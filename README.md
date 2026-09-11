# NOVA – Team Productivity Platform

> **Plan. Collaborate. Deliver.**

A full-stack project management application built as an internship assignment. NOVA allows teams to create projects, manage tasks on a Kanban board, collaborate with team members, and track project progress in real time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## Features

- ✅ User registration & login with JWT authentication
- ✅ Protected routes — unauthenticated users redirected to login
- ✅ Dashboard with project stats (total projects, tasks, completed, in-progress)
- ✅ Create, view, edit, and delete projects
- ✅ Add/remove project members (by email)
- ✅ Kanban board — To Do / In Progress / Completed
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to team members
- ✅ Task priority: Low / Medium / High
- ✅ Task due dates with overdue highlighting
- ✅ Live project progress bar
- ✅ Cascade delete — deleting a project removes all its tasks

---

## Project Structure

```
Sankar-NOVA/
├── client/          ← React + Vite frontend
└── server/          ← Node.js + Express backend
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/gangotrigupta-61/NOVA-.git
cd NOVA-
```

### 2. Set up the backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

The API will start on `http://localhost:5000`.

### 3. Set up the frontend
```bash
cd ../client
npm install
# No .env needed for local dev — the Vite proxy forwards /api to localhost:5000
npm run dev
```

The app will start on `http://localhost:5173`.

---

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/nova
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`) — production / Vercel deployment
```env
VITE_API_URL=https://nova-sp2j.onrender.com/api
```

---

## Deployment

### Step 1 — MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist IP `0.0.0.0/0` (allow from anywhere)
4. Copy the connection string

### Step 2 — Backend on Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node index.js`
6. Add environment variables:
   - `MONGODB_URI` → your Atlas connection string
   - `JWT_SECRET` → a long random string
   - `CLIENT_URL` → `https://nova-topaz-eight.vercel.app`
7. ✅ **Already deployed at**: `https://nova-sp2j.onrender.com`

### Step 3 — Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo
3. Set **Root Directory** to `client`
4. Add environment variable:
   - `VITE_API_URL` → `https://nova-sp2j.onrender.com/api`
5. ✅ **Already deployed at**: `https://nova-topaz-eight.vercel.app`

### Step 4 — Update CORS on Render
Go back to Render and set `CLIENT_URL` to `https://nova-topaz-eight.vercel.app`. Redeploy.

> **🌐 Live URLs**
> - **Frontend**: https://nova-topaz-eight.vercel.app
> - **Backend**: https://nova-sp2j.onrender.com
> - **Health check**: https://nova-sp2j.onrender.com/api/health

---

## API Endpoints

### Auth
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login
GET    /api/auth/me          Get current user (protected)
```

### Projects (all protected)
```
GET    /api/projects              List user's projects
POST   /api/projects              Create project
GET    /api/projects/:id          Get project
PUT    /api/projects/:id          Update project
DELETE /api/projects/:id          Delete project + cascade tasks
POST   /api/projects/:id/members  Add member by email
DELETE /api/projects/:id/members/:userId  Remove member
```

### Tasks (all protected)
```
GET    /api/projects/:id/tasks    List project tasks
POST   /api/projects/:id/tasks    Create task
PUT    /api/tasks/:taskId         Update task
PATCH  /api/tasks/:taskId/status  Quick status update
DELETE /api/tasks/:taskId         Delete task
```

---

## Database Models

### User
```
name, email, password (hashed), avatarColor, createdAt
```

### Project
```
name, description, color, owner → User, members → [User], createdAt
```

### Task
```
title, description, project → Project, assignee → User,
createdBy → User, status (todo|in_progress|completed),
priority (low|medium|high), dueDate, createdAt
```

---

*Built with ❤️ as a NOVA internship assignment.*
