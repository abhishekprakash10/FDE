"""
schemas.py - Pydantic request/response models for PulseCheck API
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class SurveyIn(BaseModel):
    """Payload for creating a new survey entry."""

    respondent_name: str = Field(..., min_length=1, max_length=120, description="Full name of the respondent")
    course_name: str = Field(..., min_length=1, max_length=200, description="Program or event name")
    score: int = Field(..., ge=1, le=5, description="Rating score between 1 and 5")
    remarks: Optional[str] = Field(None, description="Optional feedback text")

    @field_validator("respondent_name", "course_name", mode="before")
    @classmethod
    def strip_whitespace(cls, value: str) -> str:
        return value.strip()


class SurveyPatch(BaseModel):
    """Payload for partially updating an existing survey entry (all fields optional)."""

    respondent_name: Optional[str] = Field(None, min_length=1, max_length=120)
    course_name: Optional[str] = Field(None, min_length=1, max_length=200)
    score: Optional[int] = Field(None, ge=1, le=5)
    remarks: Optional[str] = None

    @field_validator("respondent_name", "course_name", mode="before")
    @classmethod
    def strip_whitespace(cls, value: Optional[str]) -> Optional[str]:
        if value is not None:
            return value.strip()
        return value


class SurveyOut(BaseModel):
    """Full survey entry as returned from the API."""

    entry_id: int
    respondent_name: str
    course_name: str
    score: int
    remarks: Optional[str]
    recorded_at: datetime

    model_config = {"from_attributes": True}


class SearchParams(BaseModel):
    """Query parameters for the search endpoint."""

    keyword: Optional[str] = Field(None, description="Text search across name, course, and remarks")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Exact score filter")
    program_name: Optional[str] = Field(None, description="Partial course name filter")
