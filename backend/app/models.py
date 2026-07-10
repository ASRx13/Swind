"""
Swind Platform — Database Models

SQLAlchemy ORM models mapped to PostgreSQL tables.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime

from .database import Base


class User(Base):
    """Registered platform user."""

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
