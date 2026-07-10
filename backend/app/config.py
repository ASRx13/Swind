"""
Swind Platform — Configuration

Loads environment variables from the root .env file
and exposes them as typed settings.
"""

import os
from dotenv import load_dotenv

# Load .env from the project root (two levels up from this file)
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path=env_path)

# ── Database ─────────────────────────────────────────────
DATABASE_URL: str = os.getenv(
    'DATABASE_URL',
    'postgresql://postgres:742542@localhost:5432/swind_db'
)

# ── JWT ──────────────────────────────────────────────────
JWT_SECRET: str = os.getenv('JWT_SECRET', 'swind_dev_secret_key_2026')
JWT_ALGORITHM: str = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
