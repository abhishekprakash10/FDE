from typing import List
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from db import get_db
from schemas import IssueCreate, IssueUpdate, IssueResponse, ChangeLogEntry
from repo import IssueRepository

router = APIRouter(prefix="/api/tickets", tags=["issues"])


def verify_admin(x_role: str = Header(default="")):
    if x_role.lower() != "support_admin":
        raise HTTPException(status_code=403, detail="Access restricted to IT Admin only.")
    return x_role


@router.get("/", response_model=List[IssueResponse])
def get_all_issues(db: Session = Depends(get_db)):
    return IssueRepository.list_all(db)


@router.get("/{issue_id}", response_model=IssueResponse)
def get_single_issue(issue_id: int, db: Session = Depends(get_db)):
    record = IssueRepository.find_by_id(db, issue_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_id} not found.")
    return record


@router.post("/", response_model=IssueResponse, status_code=201)
def submit_issue(payload: IssueCreate, db: Session = Depends(get_db)):
    return IssueRepository.insert(db, payload)


@router.put("/{issue_id}", response_model=IssueResponse)
def update_issue(
    issue_id: int,
    payload: IssueUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(verify_admin),
):
    updated = IssueRepository.modify(db, issue_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_id} not found.")
    return updated


@router.delete("/{issue_id}", status_code=204)
def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(verify_admin),
):
    success = IssueRepository.remove(db, issue_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_id} not found.")


@router.get("/{issue_id}/activities", response_model=List[ChangeLogEntry])
def get_issue_activities(issue_id: int, db: Session = Depends(get_db)):
    record = IssueRepository.find_by_id(db, issue_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_id} not found.")
    return IssueRepository.get_changelog(db, issue_id)
