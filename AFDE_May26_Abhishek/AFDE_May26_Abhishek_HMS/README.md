# ServiceDesk Pro — IT Help Desk System

A full-stack IT Help Desk Ticket Management System built with FastAPI and React. Employees can raise support requests and IT Admins can manage, update, and resolve tickets — with a complete audit trail for all status changes.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | FastAPI 0.111, Python 3.10+       |
| ORM       | SQLAlchemy 2.0 (SQLite default)   |
| Validation| Pydantic v2                       |
| Server    | Uvicorn (ASGI)                    |
| Frontend  | React 18 + Vite 5                 |
| Routing   | React Router v6                   |
| HTTP      | Axios                             |
| Styling   | Plain CSS (custom design system)  |

---

## Project Structure

```
AFDE_May26_Abhishek_HMS/
├── backend/
│   ├── app.py              # FastAPI app entry point, CORS, search endpoint, SPA fallback
│   ├── db.py               # SQLAlchemy engine, session factory, Base
│   ├── models.py           # Issue (tickets table) + ChangeLog (ticket_activities table)
│   ├── schemas.py          # Pydantic schemas: IssueCreate, IssueUpdate, IssueResponse, ChangeLogEntry
│   ├── repo.py             # IssueRepository class with static CRUD + search methods
│   ├── requirements.txt
│   └── routers/
│       ├── __init__.py
│       └── issues.py       # All /api/tickets/* routes
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx         # BrowserRouter + protected routes
│       ├── index.css       # Global CSS custom properties + utilities
│       ├── http.js         # Axios instance with X-Role interceptor
│       ├── context/
│       │   └── AuthStore.jsx       # Role/username context + sessionStorage
│       ├── data/
│       │   └── issueApi.js         # API helper functions
│       ├── components/
│       │   ├── TopBar.jsx          # Horizontal nav bar (navy theme)
│       │   ├── TopBar.css
│       │   ├── StatusChip.jsx      # Pill badges for ticket status
│       │   ├── PriorityFlag.jsx    # Left-border badges for priority
│       │   ├── Badges.css
│       │   ├── SideSheet.jsx       # Right-slide drawer panel
│       │   ├── SideSheet.css
│       │   ├── Toast.jsx           # Top-right notifications with context
│       │   └── Toast.css
│       └── pages/
│           ├── Login.jsx / Login.css
│           ├── CommandCenter.jsx / CommandCenter.css    (Dashboard)
│           ├── IssueQueue.jsx / IssueQueue.css          (Ticket list)
│           ├── RaiseRequest.jsx / RaiseRequest.css      (Create ticket)
│           ├── FindIssues.jsx / FindIssues.css          (Search)
│           └── sheets/
│               ├── IssueDetail.jsx     (View ticket in side panel)
│               ├── IssueEditor.jsx     (Edit form in side panel)
│               ├── DeleteConfirm.jsx   (Delete confirmation panel)
│               ├── DeleteConfirm.css
│               ├── ActivityLog.jsx     (Status change history)
│               └── ActivityLog.css
│
└── README.md
```

---

## Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
# or: uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`

Interactive API docs: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3001
```

### Production Build

```bash
cd frontend
npm run build
# Then start only the backend:
cd ../backend
python app.py
# Visit http://127.0.0.1:8000
```

---

## API Reference

| Method | Endpoint                          | Auth Required | Description                    |
|--------|-----------------------------------|---------------|--------------------------------|
| GET    | `/api/tickets/`                   | No            | List all tickets               |
| GET    | `/api/tickets/{id}`               | No            | Get single ticket              |
| POST   | `/api/tickets/`                   | No            | Create new ticket              |
| PUT    | `/api/tickets/{id}`               | IT Admin only | Update ticket                  |
| DELETE | `/api/tickets/{id}`               | IT Admin only | Delete ticket                  |
| GET    | `/api/tickets/{id}/activities`    | No            | Get status change history      |
| GET    | `/api/search`                     | No            | Search tickets                 |

### Search Parameters (`/api/search`)

| Param      | Type   | Description                              |
|------------|--------|------------------------------------------|
| `keyword`  | string | Searches employee_name, dept, description|
| `category` | string | Exact match on issue_category            |
| `status`   | string | Exact match on status                    |

### Auth Header

IT Admin endpoints require the header:
```
X-Role: support_admin
```

---

## Roles

| Role       | Login Selection | Can Create | Can Edit | Can Delete |
|------------|-----------------|------------|----------|------------|
| Employee   | "Employee"      | Yes        | No       | No         |
| IT Admin   | "IT Admin"      | Yes        | Yes      | Yes        |

No passwords are required. The role is stored in `sessionStorage` as `sd_role`.

---

## Database Schema

### `tickets` table

| Column             | Type         | Notes                              |
|--------------------|--------------|------------------------------------|
| `ticket_id`        | INTEGER PK   | Auto-increment                     |
| `employee_name`    | VARCHAR(150) | Not null                           |
| `department`       | VARCHAR(100) | Not null                           |
| `issue_category`   | VARCHAR(100) | Not null                           |
| `description`      | TEXT         | Not null                           |
| `priority`         | VARCHAR(20)  | Default: `Medium`                  |
| `status`           | VARCHAR(30)  | Default: `Open`                    |
| `resolution_notes` | TEXT         | Nullable                           |
| `created_at`       | DATETIME     | Auto-set on insert (UTC)           |

**Priority values:** Low, Medium, High, Critical

**Status values:** Open, In Progress, Resolved, Rejected

**Category values:** VPN Issue, Password Reset, Software Installation, Laptop Issue, Email Access, Network Connectivity, Hardware Request, Other

---

### `ticket_activities` table

| Column        | Type         | Notes                              |
|---------------|--------------|------------------------------------|
| `id`          | INTEGER PK   | Auto-increment                     |
| `ticket_id`   | INTEGER FK   | References `tickets.ticket_id`     |
| `changed_by`  | VARCHAR(150) | Name of person who made the change |
| `from_status` | VARCHAR(30)  | Previous status (null on creation) |
| `to_status`   | VARCHAR(30)  | New status                         |
| `changed_at`  | DATETIME     | Auto-set (UTC)                     |

Status changes are automatically logged when a PUT request modifies the `status` field.

---

## UI Design

- **Color Theme:** Deep navy (`#1e3a5f`) primary + amber (`#f59e0b`) accent
- **Layout:** Sticky horizontal TopBar + scrollable content area
- **Components:** StatusChip pills, PriorityFlag badges, SideSheet drawer, Toast notifications
- **Responsive:** Works on screens down to 375px wide
