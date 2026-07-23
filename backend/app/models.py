"""
Swind Platform — Database Models

SQLAlchemy ORM models mapped to PostgreSQL tables.
"""

from datetime import datetime, timezone
import secrets

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    """Registered platform user."""

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    projects = relationship('Project', back_populates='owner', cascade='all, delete-orphan')


class Project(Base):
    """Renewable energy deployment project."""

    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_code = Column(String, unique=True, nullable=False, index=True)  # e.g. PRJ-2026-A8F92
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship('User', back_populates='projects')
    sites = relationship('Site', back_populates='project', cascade='all, delete-orphan')

    @staticmethod
    def generate_project_code() -> str:
        """Generate a clean, unique project identifier."""
        year = datetime.now().year
        random_suffix = secrets.token_hex(3).upper()
        return f"PRJ-{year}-{random_suffix}"


class Site(Base):
    """Candidate site registered under a project for environmental assessment."""

    __tablename__ = 'sites'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    region = Column(String, nullable=False)
    land_area = Column(Float, nullable=False)  # in hectares
    elevation = Column(Float, nullable=True)   # in meters
    existing_infrastructure = Column(String, nullable=True)  # e.g. "Substation within 5km, National Highway"
    land_ownership = Column(String, nullable=False)  # e.g. "Public", "Private", "Commercial", "Leased"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship('Project', back_populates='sites')

