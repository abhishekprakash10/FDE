"""
routers/surveys.py - API routes for feedback/survey entries (prefix: /api/feedback)
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from db import get_session
from schemas import SurveyIn, SurveyPatch, SurveyOut
from repo import SurveyRepository

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


def check_admin(x_role: Optional[str] = Header(None)) -> None:
    """Guard: raise 403 if the caller does not identify as admin."""
    if x_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required for this operation.",
        )


@router.get("/", response_model=list[SurveyOut], summary="List all feedback entries")
def list_entries(session: Session = Depends(get_session)):
    return SurveyRepository.list_all(session)


@router.get("/{entry_id}", response_model=SurveyOut, summary="Get a single feedback entry")
def get_entry(entry_id: int, session: Session = Depends(get_session)):
    entry = SurveyRepository.get_by_id(session, entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found.")
    return entry


@router.post("/", response_model=SurveyOut, status_code=status.HTTP_201_CREATED, summary="Submit new feedback")
def create_entry(payload: SurveyIn, session: Session = Depends(get_session)):
    return SurveyRepository.create(session, payload)


@router.put("/{entry_id}", response_model=SurveyOut, summary="Update a feedback entry (admin only)")
def update_entry(
    entry_id: int,
    patch: SurveyPatch,
    session: Session = Depends(get_session),
    _: None = Depends(check_admin),
):
    entry = SurveyRepository.get_by_id(session, entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found.")
    return SurveyRepository.update(session, entry, patch)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a feedback entry (admin only)")
def delete_entry(
    entry_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(check_admin),
):
    entry = SurveyRepository.get_by_id(session, entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found.")
    SurveyRepository.delete(session, entry)
