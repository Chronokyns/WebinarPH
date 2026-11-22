# WebinarMatch 🎓
### An AI-Powered Web-Based Webinar Discovery and Recommendation System for Students

WebinarMatch is a modern, centralized, AI-powered web platform designed specifically for college and university students to discover, schedule, and track academic webinars that fulfill course requirements, match personal schedules, and provide verified certificates.

> **Scope Restriction:** WebinarMatch is designed **exclusively for webinars** (virtual academic and professional learning events).

---

## 🌟 Key System Capabilities

### 1. AI Natural Language & Semantic Topic Matching
- **Constraint Extraction:** Students can query in plain language (e.g. *"Free cybersecurity webinars with certificates before December 20"*). The NLP engine parses implicit topic, price, certificate, and deadline constraints.
- **Semantic Concept Expansion:** Maps user queries (e.g. *"how to protect computer systems against hackers"*) to relevant academic subjects like Cybersecurity, Threat Hunting, and Ethical Hacking.
- **Deterministic Filter Enforcement:** Hard constraints (dates, prices, certificates) are strictly enforced in the backend to ensure zero hallucination.

### 2. Explainable Personal Recommendations
- Recommends upcoming webinars tailored to the student's academic major, selected interest tags, bookmark history, and career goals.
- Provides explicit reasons for every recommendation (e.g. *"Recommended because you are interested in Cybersecurity & InfoSec"*).

### 3. Schedule Conflict Guard & Personal Calendar
- Interactive monthly and agenda list calendar view.
- Overlap detection flags when two saved or registered webinars conflict in time.
- 1-click export to standard `.ICS` format for Google Calendar, Outlook, and Apple Calendar.

### 4. Participation Status Tracker
- Lifecycle tracking: `Interested` ➔ `Registered` ➔ `Attended` ➔ `Missed` ➔ `Cancelled`.
- Personal verification notes allow students to document assignment submissions for professors and capstone advisors.

### 5. Automated Data Aggregation & Duplicate Detection
- Extensible aggregator architecture connecting to:
  - IEEE Computer Society Educational Webinars
  - ACM Student Chapters Global Webinars
  - Google Developer Student Clubs (GDSC) Live Feed
  - AWS Educate Student Webinar Series
  - Verified University & Faculty Imports
- Normalization and duplicate detection prevent storing duplicate records based on external IDs, canonical registration URLs, and normalized title/start-time windows.

### 6. Role-Based Administrator Dashboard
- SaaS-grade admin interface with KPI metrics (Active Students, Total Webinars, Upcoming, Expired, Feed Health, Reports).
- Full webinar CRUD management.
- Student account status management (activate / deactivate).
- External data connector monitor with manual sync triggering.
- Audit logs and student-reported discrepancy resolution.

---

## 🛠️ Architecture & Tech Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite, Lucide React, Framer Motion |
| **Backend** | Python 3.11, FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| **Database** | SQLite / PostgreSQL (Relational schema with normalized tables, foreign keys, and indexes) |
| **AI / NLP** | Deterministic Intent Extraction, Term Frequency-Inverse Document Frequency (TF-IDF), Vector Cosine Similarity |
| **Security** | PBKDF2-HMAC-SHA256 password hashing, JWT Token Authentication, Role-Based Access Control |

---

## 🚀 Quick Start Guide

### Option 1: Run the Complete Application (Single Command)
Run the automated launch script:
```powershell
.\start_server.ps1
```
or on Windows Command Prompt:
```cmd
start_server.bat
```
Then open your browser at:
👉 **`http://localhost:8000`**

### Pre-Configured Demo Accounts:
| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@university.edu` | `student123` |
| **Administrator** | `admin@webinarmatch.org` | `admin123` |

*(Quick-fill buttons are also available directly on the login screen for 1-click evaluator access.)*

---

### Option 2: Running Frontend & Backend in Development Mode

**Backend:**
```powershell
.\.tools\python\python.exe -m uvicorn backend.app.main:app --reload --port 8000
```

**Frontend:**
```powershell
cd frontend
..\.tools\node\npm.cmd run dev
```

---

## 🧪 Automated System Test Suite

All 14 comprehensive system tests can be executed against the running backend:
```powershell
.\.tools\python\python.exe tests/run_tests.py
```
Output:
```
============================================================
RUNNING WEBINARMATCH AUTOMATED SYSTEM TESTS
============================================================
[PASS] 1. Health Endpoint (200 OK)
[PASS] 2. Webinar Categories (6 categories verified)
[PASS] 3. Data Aggregation Sources (5 verified sources)
[PASS] 4. Multi-Filter Deterministic Free Check (9 free webinars)
[PASS] 5. Certificate Requirement Filter (8 with certificate)
[PASS] 6. AI Semantic Concept Search ('protect computer systems' -> matched 'Defensive Security & Threat Hunting: Zero Trust in Practice' with score 0.92)
[PASS] 7. AI Constraint Extraction (Enforced: free=True, certificate=True)
[PASS] 8. Explainable Recommendations (10 suggestions generated with reasons)
[PASS] 9. Bookmark & Save Workflow (Persisted to database)
[PASS] 10. Participation Tracker (Updated status to 'registered')
[PASS] 11. Schedule Conflict Detector Endpoint (Operational)
[PASS] 12. Administrator Metrics (Students: 1, Webinars: 11, Expired: 1)
[PASS] 13. External Source Synchronization (Source: Healthy, Fetched: 1)
[PASS] 14. Single Page Application Serving (200 OK, HTML loaded)
============================================================
ALL 14 COMPREHENSIVE INTEGRATION TESTS PASSED SUCCESSFULLY!
============================================================
```

---

## 📂 Project Directory Structure

```
WebinarMatch/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py          # REST API endpoints for all entities
│   │   ├── core/
│   │   │   ├── config.py             # App settings & secret keys
│   │   │   ├── database.py           # SQLAlchemy engine & session maker
│   │   │   └── security.py           # PBKDF2 hashing & JWT encoding/decoding
│   │   ├── models/
│   │   │   └── models.py             # Relational ORM models (12 tables)
│   │   ├── schemas/
│   │   │   └── schemas.py            # Pydantic request & response schemas
│   │   ├── services/
│   │   │   ├── ai_search.py          # Semantic NLP & intent extraction engine
│   │   │   ├── recommendation_engine.py # Explainable recommendation algorithm
│   │   │   └── data_aggregator.py    # Multi-feed connector & duplicate detector
│   │   └── main.py                   # FastAPI app, static mounting & auto-seeder
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # Navbar with role badge, Footer
│   │   │   ├── webinar/              # WebinarCard, WebinarFilterBar, ConflictModal
│   │   │   └── search/               # NaturalLanguageSearchBar & intent chips
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Student & Admin authentication + demo switcher
│   │   │   ├── ThemeContext.tsx      # Light / Dark mode persistence
│   │   │   └── NotificationContext.tsx # In-app notification center
│   │   ├── pages/                    # 18 Full-featured UI pages
│   │   ├── services/
│   │   │   └── api.ts                # Client API & offline resilient persistence
│   │   ├── types/
│   │   │   └── index.ts              # Complete TypeScript interfaces
│   │   ├── App.tsx                   # Client Router & Role-Based Access Control
│   │   └── main.tsx
│   ├── dist/                         # Compiled production bundle
│   └── package.json
├── tests/
│   ├── run_tests.py                  # 14-step end-to-end integration test runner
│   └── test_api.py                   # Pytest test definitions
├── start_server.bat                  # 1-click Windows batch launcher
├── start_server.ps1                  # 1-click PowerShell launcher
└── README.md
```

---

## 🎓 Capstone Presentation Note
Built in 2026 as an academic capstone web application demonstrating full-stack engineering, relational database design, natural language information retrieval, and accessible human-centered UX design for college students.
