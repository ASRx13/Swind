"""
Swind Platform — User Routes

GET /api/users/me -> Fetch current authenticated user profile & project metrics
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Project, Site
from ..auth import get_current_user
from ..schemas import UserProfileResponse

router = APIRouter(prefix='/api/users', tags=['User Profile'])


@router.get('/me', response_model=UserProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch profile metrics for the authenticated user."""
    total_projects = db.query(Project).filter(Project.user_id == current_user.id).count()
    
    # Count total sites across all user's projects
    user_project_ids = [p.id for p in db.query(Project.id).filter(Project.user_id == current_user.id).all()]
    total_sites = db.query(Site).filter(Site.project_id.in_(user_project_ids)).count() if user_project_ids else 0

    return UserProfileResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        created_at=current_user.created_at,
        total_projects=total_projects,
        total_sites=total_sites
    )
