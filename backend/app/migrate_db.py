"""
Swind Platform — Database Migration Script

Adds missing columns to existing PostgreSQL tables (projects and sites)
without dropping data, so previously created projects and sites load cleanly.
"""

import sys
import logging
from sqlalchemy import create_engine, text
from app.config import DATABASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            logger.info("Migrating PostgreSQL tables...")

            # 1. Projects table migrations
            conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#4a90d9';"))
            
            # 2. Sites table migrations
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS energy_type VARCHAR(10) DEFAULT 'solar';"))
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS country VARCHAR;"))
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS state VARCHAR;"))
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS city VARCHAR;"))
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS boundary_type VARCHAR DEFAULT 'point';"))
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS boundary_coordinates TEXT;"))
            conn.execute(text("ALTER TABLE sites ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#4a90d9';"))

            conn.commit()
            logger.info("SUCCESS: All database table migrations applied cleanly!")
    except Exception as e:
        logger.error(f"Migration error: {e}")

if __name__ == '__main__':
    migrate()
