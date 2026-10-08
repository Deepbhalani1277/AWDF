# Advanced Web Development Frameworks (AWDF) — Master Practicals Repository

**Student:** Deep Bhalani  
**Institution:** Charotar University of Science and Technology (CHARUSAT) — CSE  
**Semester:** 5th Semester  
**Course:** Advanced Web Development Frameworks (AWDF)  

---

## 📖 Overview

This repository unifies **Practicals 1, 2, 3, 4, and 5** into a cohesive full-stack web application. It features a modern modular React frontend (Vite) and an Express RESTful API backend connected to MongoDB via Mongoose ODM with robust schema validation, custom hooks, and structured error handling.

---

## 📂 Project Architecture

```text
awdf-project/
├── frontend/                          # Client application (React + Vite)
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── components/                # Modular UI Components
│   │   │   ├── Header.jsx & .css      # [Prac 1] Hero section with props
│   │   │   ├── About.jsx & .css       # [Prac 1] Student bio & details
│   │   │   ├── Skills.jsx & .css      # [Prac 1] Tech stack cards
│   │   │   ├── Footer.jsx & .css      # [Prac 1] Consistent site footer
│   │   │   ├── Navbar.jsx & .css      # [Prac 1 & 2] Sticky navigation bar
│   │   │   ├── SearchBar.jsx & .css   # [Prac 3] Live keyword search bar
│   │   │   ├── Spinner.jsx & .css     # [Prac 3] CSS loading spinner
│   │   │   ├── ErrorMessage.jsx & .css# [Prac 3] Error alert with retry
│   │   │   └── RepoCard.jsx & .css    # [Prac 3] GitHub repository card
│   │   ├── pages/                     # Routed Views
│   │   │   ├── Home.jsx & .css        # Integrated Portfolio view (Prac 1 & 2)
│   │   │   ├── Projects.jsx & .css    # Coursework showcase (Prac 2)
│   │   │   ├── Repositories.jsx & .css# GitHub API integration (Prac 3)
│   │   │   ├── Tasks.jsx & .css       # Fullstack MongoDB Task Manager UI (Prac 4 & 5)
│   │   │   ├── Contact.jsx & .css     # Reactive contact form (Prac 2)
│   │   │   └── NotFound.jsx & .css    # 404 handler page (Prac 2)
│   │   ├── App.jsx & App.css          # React Router composition
│   │   ├── index.css                  # Global styling reset & variables
│   │   └── main.jsx                   # Vite root entrypoint
│   ├── vite.config.js                 # Proxy config for backend API
│   └── package.json
│
├── backend/                           # Server REST API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/
│   │   │   └── Task.js                # [Prac 5] Mongoose Schema & pre-save hook
│   │   ├── controllers/
│   │   │   └── taskController.js      # [Prac 5] Mongoose CRUD controllers (async/await)
│   │   ├── routes/
│   │   │   └── taskRoutes.js          # [Prac 4 & 5] /tasks router
│   │   ├── middleware/
│   │   │   ├── logger.js              # [Prac 4] Global request logger
│   │   │   ├── validateId.js          # [Prac 5] MongoDB ObjectId format validator
│   │   │   ├── contentTypeValidator.js# [Prac 4] Content-Type application/json check
│   │   │   ├── notFoundHandler.js     # [Prac 4] 404 undefined endpoint fallback
│   │   │   └── errorHandler.js        # [Prac 5] Mongoose ValidationError/CastError parser
│   │   └── data/
│   │       └── tasks.js               # [Prac 4] Legacy in-memory seed reference
│   ├── public/                        # Standalone API interactive test bench
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── server.js                      # Express application & MongoDB connection
│   ├── .env                           # Local environment variables (git-ignored)
│   ├── .env.example                   # Environment configuration template
│   └── package.json
│
├── package.json                       # Monorepo root scripts (concurrently)
├── .gitignore                         # Standard git ignore (node_modules, .env)
└── README.md                          # Repository documentation
```

---

## 🚀 Practicals Breakdown

### 🔹 Practical 1: React Components & Props
* **Objective:** Construct modular UI with functional components and props passing.
* **Key Components:** `Header`, `About`, `Skills`, `Footer`.

### 🔹 Practical 2: State Management & Routing
* **Objective:** Client-side routing via React Router and reactive state via `useState`.
* **Key Features:** Multi-page routing (`/`, `/projects`, `/contact`, `/not-found`), Contact form character counter.

### 🔹 Practical 3: REST API Integration & Data Rendering
* **Objective:** Consume an external REST API asynchronously with loading and error boundaries.
* **Key Features:** GitHub API integration (`Deepbhalani1277`), search filtering, loading spinner, error retry.

### 🔹 Practical 4: RESTful API Backend with Express
* **Objective:** Build a complete RESTful API with structured routing and custom middleware pipeline.
* **Key Features:** In-memory CRUD endpoints on `/tasks`, request logging, Content-Type validation, numeric ID validation, 404 and 500 error handlers.

### 🔹 Practical 5: MongoDB Integration & Schema Design with Mongoose
* **Objective:** Connect a MongoDB database to an Express server and enforce data validation through Mongoose schema.
* **Database Connection:** Connected via Mongoose using `MONGO_URI` from `.env`.
* **Schema Definition (`models/Task.js`):**
  - `title`: String, required (`required: [true, 'Task title is required']`), trimmed.
  - `description`: String, default `""`.
  - `completed`: Boolean, default `false`.
  - `priority`: String, enum: `['low', 'medium', 'high']`, default `'medium'` *(Supplementary)*.
  - `createdAt`: Date, default `Date.now`.
* **Pre-Save Hook:** Automatically trims whitespace from the `title` field before saving to the database *(Supplementary)*.
* **Mongoose Operations:**
  - `Task.find()` with filtering (status, priority, keyword search).
  - `Task.findById()` with 404 handling if non-existent *(Supplementary)*.
  - `Task.create()` enforcing schema constraints.
  - `Task.findByIdAndUpdate()` with `{ new: true, runValidators: true }`.
  - `Task.findByIdAndDelete()` for document removal.
* **Structured Error Responses:** Global error handler intercepts Mongoose `ValidationError` and `CastError` to return clean, structured JSON responses instead of raw database stack traces.

---

## 🛠️ API Reference Table

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/tasks` | List all tasks from MongoDB (supports `?completed=`, `?priority=`, `?search=`) | `200 OK` |
| `GET` | `/tasks/:id` | Get task document by MongoDB ObjectId | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/tasks` | Insert task document with Mongoose validation | `201 Created`, `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update task document with schema validation | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE`| `/tasks/:id` | Delete task document from MongoDB | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/tasks/simulate/error` | Deliberately triggers internal error to test 500 handler | `500 Internal Server Error` |

---

## ⚡ Quick Start & Run Guide

### 1. Configure Environment
Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```

### 2. Start Both Frontend and Backend Concurrently
From the root directory:
```bash
npm run dev
```
* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:5000
* **API Test Bench:** http://localhost:5000/
