"""
Swind Platform — Auth Routes

POST /api/auth/signup
POST /api/auth/login
POST /api/auth/forgot-password
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import (
    UserSignup,
    UserLogin,
    ForgotPassword,
    TokenResponse,
    MessageResponse,
    UserResponse,
)
from ..auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix='/api/auth', tags=['Auth'])


# ── Signup ───────────────────────────────────────────────
@router.post('/signup', response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    """Register a new user account."""

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Email already registered.',
        )

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {'message': 'Account created successfully!'}


# ── Login ────────────────────────────────────────────────
@router.post('/login', response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid email or password.',
        )

    token = create_access_token({'user_id': user.id})

    return {
        'token': token,
        'user': UserResponse.model_validate(user),
        'message': 'Login successful!',
    }


# ── Forgot password ─────────────────────────────────────
@router.post('/forgot-password', response_model=MessageResponse)
def forgot_password(payload: ForgotPassword, db: Session = Depends(get_db)):
    """
    Always returns a generic message regardless of whether the
    email exists — prevents user enumeration.
    """
    return {
        'message': 'If an account with that email exists, password reset instructions have been sent.',
    }
