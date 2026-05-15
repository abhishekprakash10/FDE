from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel


class PriorityLevel(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class IssueStatus(str, Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"
    rejected = "Rejected"


class IssueCategory(str, Enum):
    vpn = "VPN Issue"
    password = "Password Reset"
    software = "Software Installation"
    laptop = "Laptop Issue"
    email = "Email Access"
    network = "Network Connectivity"
    hardware = "Hardware Request"
    other = "Other"


class IssueCreate(BaseModel):
    employee_name: str
    department: str
    issue_category: IssueCategory
    description: str
    priority: PriorityLevel = PriorityLevel.medium


class IssueUpdate(BaseModel):
    employee_name: Optional[str] = None
    department: Optional[str] = None
    issue_category: Optional[IssueCategory] = None
    description: Optional[str] = None
    priority: Optional[PriorityLevel] = None
    status: Optional[IssueStatus] = None
    resolution_notes: Optional[str] = None
    changed_by: Optional[str] = "System"


class IssueResponse(BaseModel):
    ticket_id: int
    employee_name: str
    department: str
    issue_category: str
    description: str
    priority: str
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChangeLogEntry(BaseModel):
    id: int
    ticket_id: int
    changed_by: str
    from_status: Optional[str] = None
    to_status: str
    changed_at: datetime

    model_config = {"from_attributes": True}


class ChangeLogResponse(BaseModel):
    entries: List[ChangeLogEntry]
    total: int
