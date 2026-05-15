"""
app.py - PulseCheck application entry point
Run with: uvicorn app:app --reload --host 127.0.0.1 --port 8000
"""

import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from db import Base, engine, get_session
from models import SurveyEntry  # noqa: F401 — needed so Base knows about the table
from routers.surveys import router as survey_router
from repo import SurveyRepository
from schemas import SurveyOut

# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PulseCheck API",
    description="Feedback collection and management portal",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(survey_router)


# ---------------------------------------------------------------------------
# Search endpoint  (kept at top level so its path is /api/search)
# ---------------------------------------------------------------------------
@app.get("/api/search", response_model=list[SurveyOut], tags=["search"])
def search_entries(
    keyword: Optional[str] = Query(None),
    rating: Optional[int] = Query(None, ge=1, le=5),
    program_name: Optional[str] = Query(None),
    session: Session = Depends(get_session),
):
    """
    Search/filter survey entries.
    - keyword: case-insensitive substring match on name, course, and remarks
    - rating: exact score match (1-5)
    - program_name: case-insensitive substring match on course name
    """
    return SurveyRepository.search(session, keyword=keyword, rating=rating, program_name=program_name)


# ---------------------------------------------------------------------------
# Serve React frontend
# ---------------------------------------------------------------------------
FRONTEND_DIST = Path(__file__).parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Serve static assets (JS/CSS chunks produced by Vite)
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/", include_in_schema=False)
    def serve_root():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_spa(full_path: str):
        """Catch-all: return index.html so React Router handles client-side routing."""
        # If the requested path maps to a real file in dist, serve it directly
        target = FRONTEND_DIST / full_path
        if target.exists() and target.is_file():
            return FileResponse(str(target))
        return FileResponse(str(FRONTEND_DIST / "index.html"))
