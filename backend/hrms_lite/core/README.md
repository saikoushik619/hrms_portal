# HRMS Lite – Full-Stack Employee & Attendance Management

A lightweight HRMS application built for a coding assignment. Allows a single admin (no authentication) to manage employees and track daily attendance.

## Live Links (update after deployment)
- Live Frontend: https://your-vercel-app-name.vercel.app  
- Live Backend API: https://your-railway-app-name.up.railway.app/api  
- GitHub Repo: https://github.com/yourusername/hrms-lite

## Tech Stack
**Frontend**  
- React (Vite)  
- React Bootstrap (UI components)  
- SweetAlert2 (user-friendly popups)  
- Lucide React (icons)  
- Axios (API calls)

**Backend**  
- Django 4.2 + Django REST Framework  
- PostgreSQL database  
- No authentication (single admin as per requirement)

**Deployment**  
- Frontend → Vercel  
- Backend + DB → Railway

## Features Implemented
- Employee Management: Add (with unique ID & email validation), List, Delete
- Attendance Management: Mark Present/Absent for date, View per employee
- Bonus: Total present days count per employee
- No future dates allowed for attendance
- Meaningful error messages via SweetAlert2
- Loading, error, empty states in UI

## Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (local)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver