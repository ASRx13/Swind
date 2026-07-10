"""
Swind Platform — Pydantic Schemas

Request / response models for API validation and serialisation.
"""

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


# ── Response schemas ─────────────────────────────────────

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
