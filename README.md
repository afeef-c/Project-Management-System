# Project Management System

## Overview
A full-stack Project Management System built with **Django (Backend)** and **React (Frontend)**. The application allows users to create projects, add tasks, assign tasks to team members, and track progress. Administrators have full CRUD access to projects, tasks, and users.

## Features

### Backend (Django)
- **Models**:
  - User (using Django's built-in authentication).
  - Project: Title, description, start/end dates, and status.
  - Task: Title, description, assigned user, priority, status, and associated project.
- **API Endpoints** (using Django REST Framework):
  - Projects: CRUD operations with filters for status.
  - Tasks: CRUD operations with filters for status, priority, and assigned user.
- **Authentication**:
  - JWT authentication.
  - Role-based permissions for users and administrators.
- **Validation**:
  - Projects must have `start_date < end_date`.
  - Tasks cannot be created without an associated project.

### Frontend (React)
- **Pages**:
  - Login Page.
  - Projects Dashboard.
  - Project Detail Page.
  - Task Detail Page.
  - Admin Page (for managing all projects and tasks).
- **Features**:
  - Responsive design with Tailwind CSS.
  - State management using Redux.
  - Forms for creating and editing projects/tasks with validation.
  - Error handling and loading indicators.


---

## Usage

1. Access the application at `http://127.0.0.1:8000` for the backend and `http://localhost:5173` for the frontend.
2. Log in using the superuser credentials to manage projects and tasks.
3. Regular users can:
   - View their assigned tasks.
   - Create tasks for projects they are part of.
4. Administrators can:
   - View and manage all projects and tasks.
   - Manage users (if extended in the future).

---

## API Documentation

### Authentication
- **POST** `/api/token/`: Obtain a new access and refresh token.
- **POST** `/api/token/refresh/`: Refresh the access token.

### Projects
- **GET** `/projects/`: List all projects.
- **POST** `/projects/`: Create a new project.
- **GET** `/projects/{id}/`: Retrieve details of a specific project.
- **PUT** `/projects/{id}/`: Update a project.
- **DELETE** `/projects/{id}/`: Delete a project.

### Tasks
- **GET** `/tasks/`: List all tasks.
- **POST** `/tasks/`: Create a new task.
- **GET** `/tasks/{id}/`: Retrieve details of a specific task.
- **PUT** `/tasks/{id}/`: Update a task.
- **DELETE** `/tasks/{id}/`: Delete a task.

---

## Technologies Used

### Backend
- Django
- Django REST Framework

### Frontend
- React
- Redux
- Tailwind CSS

### Database
- SQLite (default for development; can be changed to PostgreSQL in production)

### Others
- React Toastify for notifications.


## Acknowledgements

- Django Documentation
- React Documentation
- Tailwind CSS
- Redux Toolkit
