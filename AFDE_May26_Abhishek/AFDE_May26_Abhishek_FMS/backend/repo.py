"""
repo.py - Repository pattern data-access layer for survey entries
"""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from models import SurveyEntry
from schemas import SurveyIn, SurveyPatch


class SurveyRepository:
    """Class-based repository for CRUD operations on SurveyEntry."""

    @staticmethod
    def list_all(session: Session) -> list[SurveyEntry]:
        """Return all survey entries ordered by most recent first."""
        return (
            session.query(SurveyEntry)
            .order_by(SurveyEntry.recorded_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(session: Session, entry_id: int) -> Optional[SurveyEntry]:
        """Fetch a single entry by primary key; returns None if not found."""
        return session.get(SurveyEntry, entry_id)

    @staticmethod
    def create(session: Session, payload: SurveyIn) -> SurveyEntry:
        """Persist a new survey entry and return the saved object."""
        new_entry = SurveyEntry(
            respondent_name=payload.respondent_name,
            course_name=payload.course_name,
            score=payload.score,
            remarks=payload.remarks,
        )
        session.add(new_entry)
        session.commit()
        session.refresh(new_entry)
        return new_entry

    @staticmethod
    def update(session: Session, entry: SurveyEntry, patch: SurveyPatch) -> SurveyEntry:
        """Apply a partial update to an existing entry and return it."""
        update_data = patch.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(entry, field, value)
        session.commit()
        session.refresh(entry)
        return entry

    @staticmethod
    def delete(session: Session, entry: SurveyEntry) -> None:
        """Remove an entry from the database."""
        session.delete(entry)
        session.commit()

    @staticmethod
    def search(
        session: Session,
        keyword: Optional[str] = None,
        rating: Optional[int] = None,
        program_name: Optional[str] = None,
    ) -> list[SurveyEntry]:
        """
        Filter entries by keyword (ilike on name/course/remarks),
        exact score, and/or partial course name match.
        """
        query = session.query(SurveyEntry)

        if keyword:
            pattern = f"%{keyword}%"
            query = query.filter(
                or_(
                    SurveyEntry.respondent_name.ilike(pattern),
                    SurveyEntry.course_name.ilike(pattern),
                    SurveyEntry.remarks.ilike(pattern),
                )
            )

        if rating is not None:
            query = query.filter(SurveyEntry.score == rating)

        if program_name:
            query = query.filter(SurveyEntry.course_name.ilike(f"%{program_name}%"))

        return query.order_by(SurveyEntry.recorded_at.desc()).all()

    @staticmethod
    def distinct_courses(session: Session) -> list[str]:
        """Return sorted list of unique course names."""
        rows = session.query(SurveyEntry.course_name).distinct().all()
        return sorted(row[0] for row in rows)

    @staticmethod
    def average_score(session: Session) -> float:
        """Return overall average score, or 0.0 if no entries exist."""
        result = session.query(func.avg(SurveyEntry.score)).scalar()
        return round(float(result), 2) if result is not None else 0.0

    @staticmethod
    def count_by_score(session: Session, score: int) -> int:
        """Count entries with an exact score value."""
        return session.query(SurveyEntry).filter(SurveyEntry.score == score).count()

    @staticmethod
    def avg_per_course(session: Session) -> list[dict]:
        """Return list of {course_name, avg_score, count} per course."""
        rows = (
            session.query(
                SurveyEntry.course_name,
                func.avg(SurveyEntry.score).label("avg_score"),
                func.count(SurveyEntry.entry_id).label("total"),
            )
            .group_by(SurveyEntry.course_name)
            .order_by(SurveyEntry.course_name)
            .all()
        )
        return [
            {"course_name": row.course_name, "avg_score": round(float(row.avg_score), 2), "count": row.total}
            for row in rows
        ]
