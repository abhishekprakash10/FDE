"""
models.py - SQLAlchemy ORM model for survey entries
"""

from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from db import Base


class SurveyEntry(Base):
    """ORM model representing a single survey/feedback submission."""

    __tablename__ = "survey_entries"

    entry_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    respondent_name: Mapped[str] = mapped_column(String(120), nullable=False)
    course_name: Mapped[str] = mapped_column(String(200), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return (
            f"<SurveyEntry id={self.entry_id} respondent={self.respondent_name!r} "
            f"course={self.course_name!r} score={self.score}>"
        )
