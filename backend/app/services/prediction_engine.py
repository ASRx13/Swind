"""
Swind Platform — ML Prediction Engine Service

Loads trained Random Forest & XGBoost model artifacts to perform high-speed inference:
- Solar PV Annual Generation (MWh/year)
- Wind Annual Generation (MWh/year)
- Overall Land Suitability Score (0-100%)
- Capacity Factor (%) & Recommendation Category
"""

import os
import logging
from typing import Dict, Any
import joblib
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "ml_models")

_solar_model = None
_wind_model = None
_suitability_model = None


def _load_models():
    """Lazy load models on demand."""
    global _solar_model, _wind_model, _suitability_model
    
    solar_path = os.path.join(MODEL_DIR, "solar_model.joblib")
    wind_path = os.path.join(MODEL_DIR, "wind_model.joblib")
    suitability_path = os.path.join(MODEL_DIR, "suitability_model.joblib")

    if _solar_model is None and os.path.exists(solar_path):
        _solar_model = joblib.load(solar_path)
    if _wind_model is None and os.path.exists(wind_path):
        _wind_model = joblib.load(wind_path)
    if _suitability_model is None and os.path.exists(suitability_path):
        _suitability_model = joblib.load(suitability_path)


def predict_site_potential(env_data: Dict[str, Any], land_area_ha: float, elevation_m: float = 250.0) -> Dict[str, Any]:
    """
    Run ML inference using site's environmental features & land specs.
    
    Args:
        env_data: Output dict from environmental_engine
        land_area_ha: Land area in hectares
        elevation_m: Elevation in meters
    """
    _load_models()

    ghi = env_data.get("daily_ghi_kwh_m2_day", 5.0)
    dni = env_data.get("daily_dni_kwh_m2_day", 5.5)
    temp = env_data.get("avg_temp_c", 25.0)
    v_100 = env_data.get("avg_wind_speed_100m_ms", 4.5)
    v_max = env_data.get("max_wind_speed_100m_ms", 8.0)

    # 1. Solar Prediction
    if _solar_model:
        solar_input = pd.DataFrame([{"ghi": ghi, "dni": dni, "temp": temp, "area": land_area_ha}])
        solar_mwh_year = float(_solar_model.predict(solar_input)[0])
    else:
        # Fallback deterministic physics formula
        solar_mwh_year = ghi * 365 * 0.78 * land_area_ha * 0.5

    # 2. Wind Prediction
    if _wind_model:
        wind_input = pd.DataFrame([{"v_100": v_100, "v_max": v_max, "area": land_area_ha}])
        wind_mwh_year = float(_wind_model.predict(wind_input)[0])
    else:
        # Fallback wind formula
        capacity_factor = min(0.45, max(0.08, (v_100 / 12.0) ** 3 * 0.45))
        wind_mwh_year = land_area_ha * 0.12 * 2.5 * 8760 * capacity_factor

    # Ensure non-negative predictions
    solar_mwh_year = max(100.0, round(solar_mwh_year, 1))
    wind_mwh_year = max(50.0, round(wind_mwh_year, 1))

    # Calculate Capacity Factors
    # Installed capacity: Solar ~ 0.5 MW/ha, Wind ~ 0.3 MW/ha
    installed_solar_mw = round(land_area_ha * 0.5, 2)
    installed_wind_mw = round(land_area_ha * 0.3, 2)

    solar_capacity_factor = round((solar_mwh_year / (installed_solar_mw * 8760)) * 100, 1) if installed_solar_mw > 0 else 18.5
    wind_capacity_factor = round((wind_mwh_year / (installed_wind_mw * 8760)) * 100, 1) if installed_wind_mw > 0 else 22.0

    # 3. Suitability Scoring
    if _suitability_model:
        suitability_input = pd.DataFrame([{"ghi": ghi, "wind_speed": v_100, "area": land_area_ha, "elevation": elevation_m}])
        raw_score = float(_suitability_model.predict(suitability_input)[0])
        suitability_score = round(min(98.0, max(15.0, raw_score)), 1)
    else:
        suitability_score = round(min(98.0, max(15.0, (ghi / 7.0) * 50 + (v_100 / 10.0) * 40)), 1)

    # Determine recommendation tier
    if suitability_score >= 80:
        recommendation = "Highly Suitable — Ideal for Hybrid Solar-Wind Farm"
    elif suitability_score >= 60:
        recommendation = "Suitable — High Solar Potential"
    elif suitability_score >= 40:
        recommendation = "Moderate Potential — Infrastructure Upgrades Recommended"
    else:
        recommendation = "Constrained Site — Low Resource Yield"

    return {
        "solar_annual_mwh": solar_mwh_year,
        "wind_annual_mwh": wind_mwh_year,
        "total_combined_mwh": round(solar_mwh_year + wind_mwh_year, 1),
        "installed_solar_mw": installed_solar_mw,
        "installed_wind_mw": installed_wind_mw,
        "solar_capacity_factor_pct": min(45.0, solar_capacity_factor),
        "wind_capacity_factor_pct": min(55.0, wind_capacity_factor),
        "suitability_score": suitability_score,
        "recommendation": recommendation,
        "co2_offset_tons_year": round((solar_mwh_year + wind_mwh_year) * 0.85, 1)  # ~0.85 tCO2/MWh
    }
