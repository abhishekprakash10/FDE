# PulseCheck — Feedback Collection Portal

A full-stack feedback management system built with FastAPI and React. Users submit feedback for programs/events; admins can edit and delete entries. The dashboard shows aggregate stats, program-level averages, and recent submissions.

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | FastAPI 0.111, SQLAlchemy 2.0, Pydantic 2.x |
| Database  | SQLite (file: `backend/pulsecheck.db`)      |
| Server    | Uvicorn 0.29 (ASGI)                         |
| Frontend  | React 18, Vite 5, React Router 6, Axios 1.6 |
| Styling   | Plain CSS with Inter font (Google Fonts)    |

---

## Project Structure

```
AFDE_May26_Abhishek_FMS/
├── README.md
├── backend/
│   ├── app.py              # Application entry point (uvicorn app:app)
│   ├── db.py               # SQLAlchemy engine, session factory, Base
│   ├── models.py           # ORM model: SurveyEntry (table: survey_entries)
│   ├── schemas.py          # Pydantic: SurveyIn, SurveyPatch, SurveyOut, SearchParams
│   ├── repo.py             # SurveyRepository class (data-access layer)
│   ├── requirements.txt
│   └── routers/
│       ├── __init__.py
│       └── surveys.py      # REST routes: /api/feedback/…
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx         # Routing + sidebar shell layout
        ├── index.css       # Global styles (teal/emerald theme)
        ├── http.js         # Axios instance (X-Role interceptor)
        ├── context/
        │   └── SessionContext.jsx   # Auth state (role, signIn, signOut)
        ├── data/
        │   └── surveyApi.js         # API service functions
        ├── widgets/
        │   ├── Sidebar.jsx/.css     # Fixed left sidebar navigation
        │   ├── RatingSelector.jsx/.css  # Numbered 1-5 score picker
        │   ├── ScoreMeter.jsx/.css  # Dot-based score display (●●●●○)
        │   ├── SurveyTile.jsx/.css  # Compact entry card
        │   ├── Dialog.jsx/.css      # Right-side slide-in drawer
        │   └── Notification.jsx/.css   # Bottom-left pill toasts
        └── views/
            ├── SignIn.jsx/.css      # Login page with role selector
            ├── Overview.jsx/.css    # Dashboard (stats + course table + recent)
            ├── Entries.jsx/.css     # All entries table
            ├── NewEntry.jsx/.css    # Feedback submission form
            ├── Explore.jsx/.css     # Search & filter
            └── panels/
                ├── EntryPanel.jsx   # Read-only detail drawer
                ├── EntryForm.jsx    # Edit drawer (admin)
                └── RemovePanel.jsx  # Delete confirmation drawer (admin)
```

---

## Setup Instructions

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive docs: `http://127.0.0.1:8000/docs`

### Frontend (development)

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs at `http://localhost:5173`.

### Frontend (production build)

```bash
cd frontend
npm install
npm run build
# dist/ is now served by the FastAPI backend
```

After building, visit `http://127.0.0.1:8000` to use the full app.

---

## API Endpoints

| Method | Path                     | Auth Required | Description                        |
|--------|--------------------------|---------------|------------------------------------|
| GET    | `/api/feedback/`         | No            | List all feedback entries          |
| GET    | `/api/feedback/{id}`     | No            | Get a single entry by ID           |
| POST   | `/api/feedback/`         | No            | Submit a new feedback entry        |
| PUT    | `/api/feedback/{id}`     | Admin only    | Update an existing entry           |
| DELETE | `/api/feedback/{id}`     | Admin only    | Delete an entry                    |
| GET    | `/api/search`            | No            | Search/filter entries              |

### Search Query Parameters

| Parameter      | Type    | Description                                             |
|----------------|---------|---------------------------------------------------------|
| `keyword`      | string  | Substring match on name, course, and remarks (ilike)    |
| `rating`       | integer | Exact score match (1–5)                                 |
| `program_name` | string  | Substring match on course name (ilike)                  |

### Admin Auth

Protected endpoints (`PUT`, `DELETE`) check the `X-Role: admin` HTTP header. The frontend sets this automatically via Axios interceptor when a user signs in as admin.

---

## Roles & Authentication

| Role  | Login                          | Permissions                      |
|-------|--------------------------------|----------------------------------|
| User  | Any name, no password          | View + submit feedback           |
| Admin | Username: `admin` / PW: `admin123` | View + submit + edit + delete |

Authentication is client-side only (sessionStorage). The backend checks `X-Role: admin` header for write operations.

---

## Database Schema

Table: `survey_entries`

| Column           | Type      | Notes                                |
|------------------|-----------|--------------------------------------|
| `entry_id`       | INTEGER   | Primary key, auto-increment          |
| `respondent_name`| VARCHAR   | Respondent's full name (required)    |
| `course_name`    | VARCHAR   | Program or event name (required)     |
| `score`          | INTEGER   | Rating 1–5 (required)                |
| `remarks`        | TEXT      | Optional comments                    |
| `recorded_at`    | DATETIME  | Auto-set to UTC time at creation     |

---

## UI Overview

- **Sidebar layout**: Fixed 220px teal sidebar on the left with navigation links and user info.
- **Color theme**: Teal/emerald (`#0d9488` primary, `#f0fdfa` background).
- **Score display**: Dot notation `●●●●○ Good` instead of stars.
- **Score picker**: Numbered buttons (1–5) with labels (Terrible/Poor/Okay/Good/Excellent).
- **Drawers**: Detail, edit, and delete panels slide in from the right.
- **Toasts**: Pill-shaped notifications appear at the bottom-left.
