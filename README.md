# Clean Enterprise Full-Stack Architecture
### React 18 + Node.js (Express) + Python FastAPI + PostgreSQL

A clean, modular starter architecture ready for your custom logic and models.

---

## 📁 Architecture Directory Structure

```text
FYP/
├── docker-compose.yml              # PostgreSQL + services container orchestration
├── package.json                    # Root scripts (run all services concurrently)
├── .env                            # Environment variables configuration
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules for node_modules, venv, dist
├── README.md                       # Setup & architecture guide
│
├── database/                       # Database initialization
│   ├── init.sql                   # Auto-executed script when Docker launches
│   └── schema.sql                 # Put your CREATE TABLE and index queries here
│
├── client/                         # Frontend (React 18 + Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                # Clean starter root component
│       ├── index.css              # Base CSS reset
│       ├── components/            # Put your UI components here (.gitkeep)
│       ├── pages/                 # Put your page views here (.gitkeep)
│       ├── hooks/                 # Put custom React hooks here (.gitkeep)
│       ├── context/               # Put React Context state here (.gitkeep)
│       ├── services/
│       │   └── api.js             # Base Axios instances (Node & FastAPI with token interceptor)
│       └── utils/                 # Utility helpers (.gitkeep)
│
├── server-node/                    # Node.js API Service (Express.js)
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── index.js               # Clean Express entry point & middleware
│       ├── config/
│       │   └── db.js              # PostgreSQL connection pool (pg)
│       ├── controllers/           # Put your controllers here (.gitkeep)
│       ├── routes/
│       │   └── healthRoutes.js    # Minimal /health endpoint
│       ├── middleware/
│       │   └── errorHandler.js    # Global error & 404 handler
│       ├── services/              # Put your business logic services here (.gitkeep)
│       ├── models/                # Put your data models/queries here (.gitkeep)
│       ├── validators/            # Put input validation here (.gitkeep)
│       └── utils/                 # Put helper functions here (.gitkeep)
│
└── server-python/                  # Python FastAPI Service
    ├── requirements.txt
    ├── venv/                      # Pre-configured Python virtual environment
    ├── run.py                     # Uvicorn development launcher
    ├── .env
    └── app/
        ├── __init__.py
        ├── main.py                # Clean FastAPI app & CORS setup
        ├── config.py              # Pydantic BaseSettings
        ├── database.py            # Clean SQLAlchemy engine, session maker & get_db
        ├── routers/
        │   ├── __init__.py
        │   └── health.py          # Minimal /health endpoint
        ├── models/                # Put your SQLAlchemy models here (.gitkeep)
        ├── schemas/               # Put your Pydantic schemas here (.gitkeep)
        └── services/              # Put your ML/AI or compute services here (.gitkeep)
```

---

## 🚀 Running the Project

```bash
# Start all 3 services concurrently (Node: 5000, FastAPI: 8000, React: 3000)
npm run dev

# Or run individual services:
npm run dev:client    # React Frontend
npm run dev:node      # Node.js Backend
npm run dev:python    # FastAPI Backend
npm run db:up         # PostgreSQL Docker container
```
