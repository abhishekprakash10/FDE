# AFDE May 26 — Abhishek Prakash

Full-stack web application assignments submitted as part of the AFDE (Advanced Full-Stack Development Engineering) program, May 26 batch.

---

## Projects

| Folder | Project Name | Description |
|--------|-------------|-------------|
| [`AFDE_May26_Abhishek_FMS/`](./AFDE_May26_Abhishek/AFDE_May26_Abhishek_FMS) | **PulseCheck** | Feedback Management System — collect, view, and manage training program feedback with role-based access |
| [`AFDE_May26_Abhishek_HMS/`](./AFDE_May26_Abhishek/AFDE_May26_Abhishek_HMS) | **ServiceDesk Pro** | IT Help Desk Ticket Management System — raise, track, and resolve IT support tickets with audit trail |

---

## Tech Stack (Both Projects)

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI 0.111 + Python 3.10+ |
| ORM | SQLAlchemy 2.0 (SQLite) |
| Validation | Pydantic v2 |
| Server | Uvicorn (ASGI) |
| Frontend | React 18 + Vite 5 |
| Routing | React Router v6/v7 |
| HTTP Client | Axios |
| Styling | Custom CSS (no UI framework) |

---

## Quick Start

### PulseCheck (FMS)

```bash
# Backend
cd AFDE_May26_Abhishek/AFDE_May26_Abhishek_FMS/backend
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000

# Frontend (dev)
cd ../frontend
npm install
npm run dev          # → http://localhost:5173
```

### ServiceDesk Pro (HMS)

```bash
# Backend
cd AFDE_May26_Abhishek/AFDE_May26_Abhishek_HMS/backend
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000

# Frontend (dev)
cd ../frontend
npm install
npm run dev          # → http://localhost:3001
```

> For production, run `npm run build` inside `frontend/`, then start only the backend — it serves the built React app from `frontend/dist/`.

---

## Project Details

See each project's own README for full setup, API reference, database schema, and role documentation:

- [PulseCheck README](./AFDE_May26_Abhishek/AFDE_May26_Abhishek_FMS/README.md)
- [ServiceDesk Pro README](./AFDE_May26_Abhishek/AFDE_May26_Abhishek_HMS/README.md)

---

## Documentation

Visual HTML documentation (with UI mockups) for each project:

- [PulseCheck Documentation](./AFDE_May26_Abhishek/AFDE_May26_Abhishek_FMS/Documentation/PulseCheck-Documentation.html)
- [ServiceDesk Pro Documentation](./AFDE_May26_Abhishek/AFDE_May26_Abhishek_HMS/Documentation/ServiceDesk-Documentation.html)

---

## Author

**Abhishek Prakash**  
abhishek.pr@prodapt.com
