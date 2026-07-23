"""
Swind Platform — ML Model Training Pipeline

Trains Random Forest and XGBoost regression & classification models for:
1. Solar PV Energy Output (MWh/year)
2. Wind Turbine Energy Output (MWh/year)
3. Site Suitability Score (0-100%)

Saves trained model artifacts (.joblib) into backend/app/ml_models/
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "ml_models")
os.makedirs(MODEL_DIR, exist_ok=True)


def train_solar_model():
    """Train Random Forest model to predict annual Solar PV output (MWh/yr per hectare)."""
    np.random.seed(42)
    n_samples = 1500

    # Features: GHI (kWh/m²/day), DNI (kWh/m²/day), Avg Temp (°C), Land Area (ha)
    ghi = np.random.uniform(3.0, 7.5, n_samples)
    dni = ghi * np.random.uniform(0.9, 1.3, n_samples)
    temp = np.random.uniform(10.0, 45.0, n_samples)
    area = np.random.uniform(5.0, 500.0, n_samples)

    # Physics approximation for target: Solar PV yield (MWh/year)
    # Standard 1 ha produces ~1,200 to 1,800 MWh/year depending on GHI & Temp losses (-0.4%/°C above 25°C)
    temp_loss = 1.0 - np.maximum(0, temp - 25.0) * 0.004
    pv_yield_per_ha = (ghi * 365 * 0.78 * temp_loss * 0.5)  # MWh/year/ha
    target_mwh = pv_yield_per_ha * area + np.random.normal(0, 50, n_samples)

    X = pd.DataFrame({"ghi": ghi, "dni": dni, "temp": temp, "area": area})
    y = target_mwh

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model, os.path.join(MODEL_DIR, "solar_model.joblib"))
    print("[OK] Solar PV Model trained and saved.")


def train_wind_model():
    """Train Random Forest model to predict annual Wind turbine output (MWh/yr per hectare)."""
    np.random.seed(42)
    n_samples = 1500

    # Features: Wind Speed at 100m (m/s), Max Wind Speed (m/s), Land Area (ha)
    v_100 = np.random.uniform(3.0, 12.0, n_samples)
    v_max = v_100 * np.random.uniform(1.8, 2.5, n_samples)
    area = np.random.uniform(5.0, 500.0, n_samples)

    # Physics cubic power law: P ~ v^3 above cut-in speed (3 m/s)
    capacity_factor = np.clip((v_100 / 12.0) ** 3 * 0.45, 0.05, 0.55)
    wind_turbines_per_ha = 0.12  # ~1 turbine per 8 hectares
    installed_mw = area * wind_turbines_per_ha * 2.5  # 2.5 MW turbines
    annual_mwh = installed_mw * 8760 * capacity_factor + np.random.normal(0, 100, n_samples)

    X = pd.DataFrame({"v_100": v_100, "v_max": v_max, "area": area})
    y = annual_mwh

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model, os.path.join(MODEL_DIR, "wind_model.joblib"))
    print("[OK] Wind Resource Model trained and saved.")


def train_suitability_model():
    """Train Random Forest Classifier for Land Suitability Score (0-100)."""
    np.random.seed(42)
    n_samples = 2000

    ghi = np.random.uniform(3.0, 7.5, n_samples)
    wind_speed = np.random.uniform(3.0, 12.0, n_samples)
    area = np.random.uniform(5.0, 500.0, n_samples)
    elevation = np.random.uniform(50.0, 2500.0, n_samples)

    # Heuristic scoring
    solar_score = (ghi / 7.5) * 40.0
    wind_score = (wind_speed / 12.0) * 35.0
    area_score = np.clip(area / 100.0, 0, 1) * 15.0
    elevation_penalty = np.where(elevation > 1500, 15.0, 0.0)

    total_score = np.clip(solar_score + wind_score + area_score - elevation_penalty, 10, 99)

    X = pd.DataFrame({"ghi": ghi, "wind_speed": wind_speed, "area": area, "elevation": elevation})
    y = total_score

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model, os.path.join(MODEL_DIR, "suitability_model.joblib"))
    print("[OK] Land Suitability Model trained and saved.")


if __name__ == "__main__":
    train_solar_model()
    train_wind_model()
    train_suitability_model()
    print("SUCCESS: All ML models successfully compiled into backend/app/ml_models/")
