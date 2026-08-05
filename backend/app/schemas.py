"""
Swind Platform — Pydantic Schemas

Request / response models for API validation and serialisation.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


# ── Request schemas ──────────────────────────────────────

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2)
    region: str = Field(..., min_length=2)
    description: Optional[str] = None


class ProjectRename(BaseModel):
    name: str = Field(..., min_length=2)


class SiteCreate(BaseModel):
    name: str = Field(..., min_length=2)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    region: str
    land_area: float = 0.0  # in hectares
    elevation: Optional[float] = 0.0
    existing_infrastructure: Optional[str] = ''
    land_ownership: str = 'Not Specified'
    energy_type: str = 'solar'  # 'solar' or 'wind'
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    boundary_type: str = 'point'  # 'point', 'circle', 'rectangle', 'polygon'
    boundary_coordinates: Optional[str] = None  # JSON string


# ── Response schemas ─────────────────────────────────────

class SiteResponse(BaseModel):
    id: int
    project_id: int
    name: str
    latitude: float
    longitude: float
    region: str
    land_area: float
    elevation: Optional[float]
    existing_infrastructure: Optional[str]
    land_ownership: str
    energy_type: str
    country: Optional[str]
    state: Optional[str]
    city: Optional[str]
    boundary_type: str
    boundary_coordinates: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    id: int
    project_code: str
    name: str
    region: str
    description: Optional[str]
    created_at: datetime
    sites: List[SiteResponse] = []

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    total_projects: int = 0
    total_sites: int = 0

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    token: str
    user: UserResponse
    message: str


class MessageResponse(BaseModel):
    message: str

