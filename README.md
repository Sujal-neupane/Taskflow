# TaskFlow 🚀

A production-ready Task & Project Management app built with:

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS    |
| Backend  | Node.js + Express                 |
| Auth/DB  | Supabase (PostgreSQL + JWT)       |
| DevOps   | Docker + Docker Compose + Nginx   |

---

## Project Structure

```
taskflow/
├── docker-compose.yml          # Dev environment
├── docker-compose.prod.yml     # Production environment
├── .env.example                # Root env template
├── schema.sql                  # Supabase DB schema (run this first)
│
├── frontend/
│   ├── Dockerfile              # Multi-stage: Vite build → Nginx
│   ├── Dockerfile.dev          # Hot-reload dev container
│   ├── nginx.conf              # SPA routing + /api proxy
│   └── src/
│       ├── lib/
│       │   ├── supabase.js     # Supabase browser client
│       │   └── api.js          # Axios client (auto-attaches JWT)
│       ├── context/
│       │   └── AuthContext.jsx # Global auth state
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Modal.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── TaskCard.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Auth.jsx        # Sign in / Sign up
│           ├── Dashboard.jsx   # Projects overview + stats
│           └── Project.jsx     # Kanban board for tasks
│
└── backend/
    ├── Dockerfile
    ├── server.js               # Express app entry
    ├── middleware/
    │   └── auth.js             # JWT verification
    ├── lib/
    │   └── supabase.js         # Service-role Supabase client
    └── routes/
        ├── projects.js         # CRUD + task listing per project
        └── tasks.js            # Update status/priority, delete
```

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free project.

2. Open **SQL Editor** → **New Query**, paste the contents of `schema.sql`, and click **Run**.

3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY`  *(keep secret — backend only)*

4. Go to **Project Settings → API → JWT Settings** and copy:
   - **JWT Secret** → `SUPABASE_JWT_SECRET`

5. *(Optional)* In **Authentication → Settings**, disable **"Confirm email"** for local dev.

---

## Step 2 — Environment Variables

Copy and fill in the env file:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5173
```

---

## Step 3 — Run with Docker (Recommended)

### Development (hot reload)

```bash
docker compose up --build
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:4000    |
| Health   | http://localhost:4000/health |

### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The frontend container serves the built React app via Nginx on port **80**, and proxies `/api/*` to the backend container. No ports are exposed from the backend directly.

---

## Step 4 — Run without Docker (Local)

### Backend

```bash
cd backend
cp .env.example .env     # fill in values
npm install
npm run dev              # nodemon hot reload
```

### Frontend

```bash
cd frontend
cp .env.example .env     # fill in values
npm install
npm run dev              # Vite dev server
```

---

## API Reference

All endpoints require an `Authorization: Bearer <supabase_jwt>` header.

### Projects

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/projects`        | List all user projects   |
| POST   | `/api/projects`        | Create a project         |
| PATCH  | `/api/projects/:id`    | Update project           |
| DELETE | `/api/projects/:id`    | Delete project + tasks   |
| GET    | `/api/projects/:id/tasks` | List tasks for project |
| POST   | `/api/projects/:id/tasks` | Create a task          |

### Tasks

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| PATCH  | `/api/tasks/:id`  | Update status/priority   |
| DELETE | `/api/tasks/:id`  | Delete a task            |

### Request body examples

**POST /api/projects**
```json
{ "name": "My App", "description": "Build something great", "color": "#5588ff" }
```

**POST /api/projects/:id/tasks**
```json
{ "title": "Set up CI/CD", "description": "Use GitHub Actions", "priority": "high" }
```

**PATCH /api/tasks/:id**
```json
{ "status": "done" }
```

---

## Auth Flow

```
User signs in via Supabase (frontend)
  → Supabase returns JWT access token
  → Frontend stores token in memory (via Supabase client)
  → Axios interceptor attaches token as Bearer header on every request
  → Express middleware verifies token using SUPABASE_JWT_SECRET
  → req.user = { id, email } available in all route handlers
  → Supabase RLS double-enforces row ownership at DB level
```

---

## Deployment Tips

### Vercel (Frontend only, without Docker)
```bash
cd frontend
npm run build
# Deploy /dist to Vercel, set VITE_* env vars in dashboard
```

### Railway / Render (Backend)
- Point to `/backend` directory
- Set all env vars in the dashboard
- Set start command: `node server.js`

### VPS with Docker
```bash
git clone <your-repo>
cp .env.example .env && nano .env
docker compose -f docker-compose.prod.yml up -d
```

---

## Features

- ✅ JWT authentication via Supabase
- ✅ Create / delete projects with colors
- ✅ Kanban board (To Do → In Progress → Done)
- ✅ Task priority (low / medium / high)
- ✅ Progress bar per project
- ✅ Search and filter
- ✅ Row Level Security (users only see their own data)
- ✅ Dockerized dev + production
- ✅ Nginx SPA routing + API proxy
- ✅ Health check endpoint
