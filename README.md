# HRMS Lite – Full Stack Coding Assignment

## Project Overview
HRMS Lite is a lightweight Human Resource Management System designed as part of a full-stack coding assignment.  
The application allows an admin to manage employee records and track daily attendance through a clean, professional web interface.

The goal of this project is to demonstrate end-to-end full-stack development skills including frontend development, backend API design, database persistence, validations, error handling, and deployment readiness.

---

## Live Application URLs

### Frontend (Live)
https://hrms-portal-topaz.vercel.app

### Backend API (Live)
https://sai619.pythonanywhere.com

### Admin Panel
https://sai619.pythonanywhere.com/admin/

---

## Tech Stack Used

### Frontend
- React (Vite)
- JavaScript
- Axios
- React Bootstrap
- SweetAlert2

### Backend
- Python
- Django
- Django REST Framework

### Database
- SQLite (Local development)
- PostgreSQL (Production)

### Deployment
- Frontend: Vercel
- Backend: PythonAnywhere

---

## Core Features Implemented

### Employee Management
- Add a new employee with:
  - Employee ID (unique)
  - Full Name
  - Email Address
  - Department
- View list of all employees
- Delete an employee

### Attendance Management
- Mark attendance for employees
  - Date
  - Status (Present / Absent)
- View attendance records per employee

---

## Backend Validations & Error Handling
- Required field validation
- Email format validation
- Duplicate employee ID handling
- Proper HTTP status codes
- Meaningful error messages returned to frontend

---

## Steps to Run the Project Locally

### Backend Setup
```bash
cd backend/hrms_lite
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver



## frontend setup

cd frontend
npm install
npm run dev

## frontend environment variables
VITE_API_BASE_URL=https://sai619.pythonanywhere.com


# github repository

https://github.com/saikoushik619/hrms_portal
