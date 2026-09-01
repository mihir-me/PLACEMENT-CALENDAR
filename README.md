# Placement Calendar

A full-stack, multi-user placement/job-application calendar web application with a clean, minimal calendar interface.

## Features

- **Multi-user Authentication** - Register/Login with JWT-based authentication
- **Password Security** - bcrypt password hashing (never stored in plain text)
- **MongoDB Persistence** - All data stored permanently in MongoDB
- **Monthly Calendar** - Clean calendar view with month navigation
- **Event CRUD** - Create, Read, Update, Delete placement events
- **Event Details Modal** - Click events to view/edit details
- **Status Tracking** - OA, Interview 1, Interview 2, HR, Placed, Rejected
- **Placement Location** - RVITM, RVECE, Home
- **Offer Types** - Intern, Intern + PBC, Intern + FTE, FTE
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

## Folder Structure

```
placement-calendar/
├── client/                  # React frontend (deployed to Vercel)
│   ├── src/
│   │   ├── components/      # Calendar UI components
│   │   ├── pages/           # Login, Register, Calendar
│   │   ├── context/         # Auth context
│   │   ├── services/        # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                  # Express backend (deployed to Render)
│   ├── config/              # Database configuration
│   ├── controllers/         # Auth & Event controllers
│   ├── middleware/          # JWT authentication middleware
│   ├── models/              # Mongoose schemas (User, Event)
│   ├── routes/              # API routes
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── render.yaml              # Render deployment config
├── package.json             # Root package.json
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
git clone <repo-url>
cd placement-calendar

# Install all dependencies
npm run install-all
```

### 2. Environment Variables

**Backend** — create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/placement_calendar?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
```

**Frontend** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Run both server and client
npm run dev

# Or run separately:
npm run server    # Backend on :5000
npm run client    # Frontend on :5173
```

Open http://localhost:5173

---

## Deployment

### MongoDB Atlas

1. Create free account at [mongodb.com](https://www.mongodb.com)
2. Create a cluster (free M0 tier works)
3. Create a database user
4. Whitelist all IP addresses (`0.0.0.0/0`) for Render
5. Get connection string: `mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/placement_calendar?retryWrites=true&w=majority`

### Backend — Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `placement-calendar-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Add **Environment Variables**:
   ```
   NODE_ENV          = production
   MONGODB_URI       = mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/placement_calendar?retryWrites=true&w=majority
   JWT_SECRET        = <generate-a-random-string>
   CLIENT_URL        = https://your-app.vercel.app
   ```
6. Click **Create Web Service**
7. Note the Render URL: `https://your-app.onrender.com`

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:
   ```
   VITE_API_URL = https://your-app.onrender.com/api
   ```
5. Click **Deploy**
6. Note the Vercel URL: `https://your-app.vercel.app`

### Update CORS

After deployment, update the Render environment variable:

```
CLIENT_URL = https://your-app.vercel.app
```

The server will automatically allow requests from this origin.

---

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

#### Register
```json
POST /api/auth/register
{
  "name": "Mihir",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | Get user's events | Yes |
| GET | `/api/events/:id` | Get single event | Yes |
| POST | `/api/events` | Create event | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |

#### Create Event
```json
POST /api/events
{
  "companyName": "Google",
  "companyVisitDate": "2026-09-20",
  "status": "OA",
  "place": "RVECE",
  "offerType": "FTE"
}
```

### Event Fields

**Status:** `OA`, `INTERVIEW_1`, `INTERVIEW_2`, `HR`, `PLACED`, `REJECTED`

**Place:** `RVITM`, `RVECE`, `HOME`

**Offer Type:** `INTERN`, `INTERN_PBC`, `INTERN_FTE`, `FTE`

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- All event endpoints require authentication
- Users can only access their own events
- MongoDB credentials stored in environment variables (never committed)
- CORS configured for frontend origin only

## License

MIT
