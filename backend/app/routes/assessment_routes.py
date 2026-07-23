"""
Swind Platform — Assessment Routes

POST /api/projects/{project_id}/sites/{site_id}/assess
Executes full AI assessment pipeline:
1. Fetches environmental & solar/wind resource metrics for site coordinates.
2. Runs ML prediction models (Random Forest / XGBoost).
3. Computes Solar MWh, Wind MWh, CO2 Offsets, and 0-100% Suitability Score.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Project, Site
from ..auth import get_current_user
from ..services.environmental_engine import fetch_environmental_data
from ..services.prediction_engine import predict_site_potential

router = APIRouter(prefix='/api/projects', tags=['AI Resource Assessment'])


@router.post('/{project_id}/sites/{site_id}/assess')
async def assess_site_resource_potential(
    project_id: int,
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run full AI Environmental & Resource Assessment for a registered site.
    """
    # 1. Verify project ownership
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # 2. Verify site belongs to project
    site = db.query(Site).filter(Site.id == site_id, Site.project_id == project.id).first()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found under this project")

    # 3. Step 1: Ingest Environmental Data (Solar & Wind parameters)
    env_metrics = await fetch_environmental_data(latitude=site.latitude, longitude=site.longitude)

    # 4. Step 2 & 3: Execute ML Model Inference
    prediction_results = predict_site_potential(
        env_data=env_metrics,
        land_area_ha=site.land_area,
        elevation_m=site.elevation or 250.0
    )

    # 5. Return unified assessment report
    return {
        "project_code": project.project_code,
        "project_name": project.name,
        "site_id": site.id,
        "site_name": site.name,
        "region": site.region,
        "coordinates": {
            "latitude": site.latitude,
            "longitude": site.longitude
        },
        "land_parameters": {
            "land_area_ha": site.land_area,
            "elevation_m": site.elevation,
            "infrastructure": site.existing_infrastructure,
            "ownership": site.land_ownership
        },
        "environmental_metrics": env_metrics,
        "prediction_analytics": prediction_results
    }
