"""
Swind Platform — Database

SQLAlchemy engine, session factory, and dependency injection helper
for PostgreSQL connectivity.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .config import DATABASE_URL

# ── Engine ───────────────────────────────────────────────
engine = create_engine(DATABASE_URL)

# ── Session factory ──────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Declarative base for models ──────────────────────────
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session
    and ensures it is closed after the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
