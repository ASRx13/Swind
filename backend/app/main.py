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

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .database import engine, Base
from .routes.auth_routes import router as auth_router
from .routes.project_routes import router as project_router
from .routes.user_routes import router as user_router
from .routes.assessment_routes import router as assessment_router


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
app.include_router(project_router)
app.include_router(user_router)
app.include_router(assessment_router)


# ── Serve the React SPA build ───────────────────────────
frontend_dist = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist')

# Only mount static files if the dist folder exists (i.e. after npm run build)
if os.path.isdir(frontend_dist):
    app.mount('/assets', StaticFiles(directory=os.path.join(frontend_dist, 'assets')), name='assets')

    @app.get('/{full_path:path}')
    async def serve_spa(request: Request, full_path: str):
        """
        Catch-all route for the React SPA.
        Serves static files if they exist, otherwise returns index.html
        so React Router can handle client-side routing.
        """
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, 'index.html'))

