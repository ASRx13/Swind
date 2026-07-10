"""
Swind Platform — FastAPI Application Entry Point

Mounts API routes, CORS middleware, static frontend files,
and creates database tables on startup.

─────────────────────────────────────────────────────────
DATABASE SETUP (run once in psql or pgAdmin):

    CREATE DATABASE swind_db;

─────────────────────────────────────────────────────────
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from .database import engine, Base
from .routes.auth_routes import router as auth_router


# ── Lifespan: create tables on startup ──────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create all database tables when the application starts."""
    Base.metadata.create_all(bind=engine)
    yield


# ── FastAPI instance ─────────────────────────────────────
app = FastAPI(title='Swind Platform API', lifespan=lifespan)


# ── CORS (wide-open for development) ────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# ── API routes (MUST be registered before static mount) ──
app.include_router(auth_router)


# ── Root redirect ────────────────────────────────────────
@app.get('/')
def root():
    """Redirect the bare root to the login page."""
    return RedirectResponse(url='/pages/login.html')


# ── Serve the frontend as static files ──────────────────
frontend_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend')
app.mount('/', StaticFiles(directory=frontend_dir, html=True), name='frontend')
