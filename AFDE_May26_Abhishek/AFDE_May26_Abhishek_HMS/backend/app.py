import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fastapi import Depends
from typing import Optional, List

from db import engine, get_db, Base
from models import Issue, ChangeLog  # noqa: F401 — needed to register models
from schemas import IssueResponse
from repo import IssueRepository
from routers.issues import router as issues_router

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ServiceDesk Pro API",
    description="IT Help Desk Ticket Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register issue routes
app.include_router(issues_router)


@app.get("/api/search", response_model=List[IssueResponse])
def search_issues(
    keyword: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    return IssueRepository.search(db, keyword=keyword, category=category, status=status)


# Serve built frontend if available
_frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
_frontend_dist = os.path.normpath(_frontend_dist)

if os.path.isdir(os.path.join(_frontend_dist, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(_frontend_dist, "assets")), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa(full_path: str):
    index_file = os.path.join(_frontend_dist, "index.html")
    if os.path.isfile(index_file):
        return FileResponse(index_file)
    return {"message": "ServiceDesk Pro API is running. Frontend not built yet."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
