"""
Swind Platform — Project & Site Routes

POST   /api/projects                    -> Create a new project (auto-generates unique Project ID)
GET    /api/projects                    -> List projects for current user
GET    /api/projects/{id}               -> Get project details + associated sites
PATCH  /api/projects/{id}               -> Rename a project
DELETE /api/projects/{id}               -> Delete a project and all its sites
POST   /api/projects/{id}/sites         -> Register a candidate site under a project
DELETE /api/projects/{id}/sites/{sid}   -> Delete a single site
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Project, Site
from ..auth import get_current_user
from ..schemas import ProjectCreate, ProjectRename, ProjectResponse, SiteCreate, SiteResponse

router = APIRouter(prefix='/api/projects', tags=['Projects & Sites'])


@router.post('', response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project with an auto-generated unique Project ID."""
    code = Project.generate_project_code()
    
    # Ensure code uniqueness
    while db.query(Project).filter(Project.project_code == code).first():
        code = Project.generate_project_code()

    project = Project(
        project_code=code,
        name=payload.name,
        region=payload.region,
        description=payload.description,
        user_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get('', response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all projects for the authenticated user."""
    projects = db.query(Project).filter(Project.user_id == current_user.id).order_by(Project.created_at.desc()).all()
    return projects


@router.get('/{project_id}', response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get project details and its registered sites."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post('/{project_id}/sites', response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def register_site(
    project_id: int,
    payload: SiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register a new candidate site under a project."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    site = Site(
        project_id=project.id,
        name=payload.name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        region=payload.region,
        land_area=payload.land_area,
        elevation=payload.elevation,
        existing_infrastructure=payload.existing_infrastructure,
        land_ownership=payload.land_ownership,
        energy_type=payload.energy_type,
        country=payload.country,
        state=payload.state,
        city=payload.city,
        boundary_type=payload.boundary_type,
        boundary_coordinates=payload.boundary_coordinates,
    )
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.patch('/{project_id}', response_model=ProjectResponse)
def rename_project(
    project_id: int,
    payload: ProjectRename,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Rename an existing project."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    project.name = payload.name
    db.commit()
    db.refresh(project)
    return project


@router.delete('/{project_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an entire project and all its associated sites."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


@router.patch('/{project_id}/sites/{site_id}', response_model=SiteResponse)
def rename_site(
    project_id: int,
    site_id: int,
    payload: ProjectRename,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Rename a single site within a project."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    site = db.query(Site).filter(Site.id == site_id, Site.project_id == project.id).first()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    site.name = payload.name
    db.commit()
    db.refresh(site)
    return site


@router.delete('/{project_id}/sites/{site_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_site(
    project_id: int,
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a single site from a project."""
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    site = db.query(Site).filter(Site.id == site_id, Site.project_id == project.id).first()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    db.delete(site)
    db.commit()
    return None
