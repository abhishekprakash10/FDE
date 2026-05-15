from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from models import Issue, ChangeLog
from schemas import IssueCreate, IssueUpdate


class IssueRepository:

    @staticmethod
    def list_all(db: Session):
        return db.query(Issue).order_by(Issue.created_at.desc()).all()

    @staticmethod
    def find_by_id(db: Session, issue_id: int):
        return db.query(Issue).filter(Issue.ticket_id == issue_id).first()

    @staticmethod
    def insert(db: Session, data: IssueCreate):
        new_issue = Issue(
            employee_name=data.employee_name,
            department=data.department,
            issue_category=data.issue_category,
            description=data.description,
            priority=data.priority,
            status="Open",
        )
        db.add(new_issue)
        db.commit()
        db.refresh(new_issue)

        # Log the initial creation as a status entry
        log_entry = ChangeLog(
            ticket_id=new_issue.ticket_id,
            changed_by=data.employee_name,
            from_status=None,
            to_status="Open",
            changed_at=datetime.utcnow(),
        )
        db.add(log_entry)
        db.commit()

        return new_issue

    @staticmethod
    def modify(db: Session, issue_id: int, data: IssueUpdate):
        record = db.query(Issue).filter(Issue.ticket_id == issue_id).first()
        if not record:
            return None

        prev_status = record.status
        changed_by = data.changed_by or "System"

        update_fields = data.model_dump(exclude_unset=True, exclude={"changed_by"})
        for field, value in update_fields.items():
            if value is not None:
                setattr(record, field, value)

        db.commit()
        db.refresh(record)

        # Auto-log when status changes
        new_status = record.status
        if new_status != prev_status:
            log_entry = ChangeLog(
                ticket_id=issue_id,
                changed_by=changed_by,
                from_status=prev_status,
                to_status=new_status,
                changed_at=datetime.utcnow(),
            )
            db.add(log_entry)
            db.commit()

        return record

    @staticmethod
    def remove(db: Session, issue_id: int):
        record = db.query(Issue).filter(Issue.ticket_id == issue_id).first()
        if not record:
            return False
        db.delete(record)
        db.commit()
        return True

    @staticmethod
    def get_changelog(db: Session, issue_id: int):
        return (
            db.query(ChangeLog)
            .filter(ChangeLog.ticket_id == issue_id)
            .order_by(ChangeLog.changed_at.asc())
            .all()
        )

    @staticmethod
    def search(
        db: Session,
        keyword: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
    ):
        query = db.query(Issue)

        if keyword:
            like_pattern = f"%{keyword}%"
            query = query.filter(
                or_(
                    Issue.employee_name.ilike(like_pattern),
                    Issue.department.ilike(like_pattern),
                    Issue.description.ilike(like_pattern),
                )
            )

        if category:
            query = query.filter(Issue.issue_category == category)

        if status:
            query = query.filter(Issue.status == status)

        return query.order_by(Issue.created_at.desc()).all()
