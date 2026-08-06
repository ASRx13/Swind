"""
Swind Platform — Auth Routes

POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/forgot-password
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

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
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix='/api/auth', tags=['Auth'])


# ── Signup ───────────────────────────────────────────────
@router.post('/signup', response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    """Register a new user account and directly authenticate them."""
    normalized_email = payload.email.lower().strip()

    existing = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Email already registered.',
        )

    user = User(
        name=payload.name.strip(),
        email=normalized_email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({'user_id': user.id})

    return {
        'token': token,
        'user': UserResponse.model_validate(user),
        'message': 'Account created successfully!',
    }


# ── Login ────────────────────────────────────────────────
@router.post('/login', response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""
    normalized_email = payload.email.lower().strip()

    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
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


# ── Verify Current User Session ──────────────────────────
@router.get('/me', response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Verify JWT token signature and return current user profile."""
    return UserResponse.model_validate(current_user)


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
