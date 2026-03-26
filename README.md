# Task Management System (React + Node.js)

## Overview
Full-stack task tracker with authentication, CRUD task management, filtering, search, and analytics.

## Backend
Path: `backend`

1. Install: `npm install`
2. Run: `npm run dev` (or `npm start`)
3. API base: `http://localhost:5000/api`

Endpoints:
- `POST /api/auth/signup` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/tasks` Authorization `Bearer <token>`
- `POST /api/tasks` Authorization + body
- `PUT /api/tasks/:id` Authorization + body
- `DELETE /api/tasks/:id`

## Frontend
Path: `frontend`

1. Install: `npm install`
2. Start: `npm run dev`
3. Open: `http://localhost:3000`

Set backend URL via env var `VITE_API_URL` if needed.

## Features
- Signup/login with JWT
- Task create/update/delete
- Task statuses: Todo, In Progress, Done
- Priority levels: Low, Medium, High
- Search + filter by status/priority
- Basic analytics cards
- Form validation and loading/error states
