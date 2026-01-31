# HRMS Lite - Employee & Attendance Management System

## Project Overview
A lightweight, clean, and professional web app for managing employee records and daily attendance. Built for a single admin (no auth required) as per assignment. Focuses on core features: add/list/delete employees, mark/view attendance per employee, with validations, error handling, and bonus total present days.

**Live Application URL:** https://your-vercel-frontend-url.vercel.app (update after deploy)  
**Live Backend API:** https://your-railway-backend.up.railway.app/api (update after deploy)  
**GitHub Repository:** https://github.com/yourusername/hrms-lite

## Tech Stack
- Frontend: React (Vite), React Bootstrap, SweetAlert2, Lucide React icons, Axios
- Backend: Django 4.2, Django REST Framework
- Database: PostgreSQL
- Deployment: Vercel (frontend), Railway (backend)

## Steps to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL installed (local)

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

API at http://127.0.0.1:8000/api/

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Open http://localhost:5173

### Full Run
- Start backend first
- Start frontend
- Open browser → use the app

## Assumptions & Limitations
- No authentication (explicit assignment constraint: "single admin user (no authentication required)")
- All endpoints/UI open to public (demo only)
- Attendance marking restricted to today/past dates (future blocked for realism)
- No employee/attendance edit (out of scope)
- No advanced filtering/dashboard (bonus total present days implemented)

## Bonus Implemented
- Display total present days per employee in Attendance view

Thanks for reviewing! 🚀