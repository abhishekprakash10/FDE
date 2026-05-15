from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db import Base


class Issue(Base):
    __tablename__ = "tickets"

    ticket_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_name = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    issue_category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False, default="Medium")
    status = Column(String(30), nullable=False, default="Open")
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    changelog = relationship("ChangeLog", back_populates="issue", cascade="all, delete-orphan")


class ChangeLog(Base):
    __tablename__ = "ticket_activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id", ondelete="CASCADE"), nullable=False)
    changed_by = Column(String(150), nullable=False)
    from_status = Column(String(30), nullable=True)
    to_status = Column(String(30), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow)

    issue = relationship("Issue", back_populates="changelog")
