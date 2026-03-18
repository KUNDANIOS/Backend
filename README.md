# TaskFlow – Backend Intern Assignment

A scalable REST API with JWT authentication, role-based access control, and a React frontend.

## Tech Stack
| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Backend  | Node.js, Express.js, MongoDB, Mongoose        |
| Auth     | JWT (jsonwebtoken), bcryptjs                  |
| Docs     | Swagger (swagger-jsdoc + swagger-ui-express)  |
| Frontend | React 18, Vite, Axios, React Router v6        |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd backend-intern-assignment

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env → set MONGO_URI and JWT_SECRET
```

### 3. Run
```bash
# Terminal 1 – Backend
cd server && npm run dev

# Terminal 2 – Frontend
cd client && npm run dev
```

### 4. Open
| Service      | URL                              |
|--------------|----------------------------------|
| Frontend     | http://localhost:5173            |
| API          | http://localhost:5000            |
| Swagger Docs | http://localhost:5000/api-docs   |
| Health Check | http://localhost:5000/health     |

## API Reference

### Auth
| Method | Endpoint               | Auth  | Role  |
|--------|------------------------|-------|-------|
| POST   | /api/v1/auth/register  | No    | —     |
| POST   | /api/v1/auth/login     | No    | —     |
| GET    | /api/v1/auth/me        | Yes   | Any   |
| GET    | /api/v1/auth/users     | Yes   | Admin |

### Tasks
| Method | Endpoint            | Auth | Role         |
|--------|---------------------|------|--------------|
| GET    | /api/v1/tasks       | Yes  | Any          |
| GET    | /api/v1/tasks/:id   | Yes  | Owner/Admin  |
| POST   | /api/v1/tasks       | Yes  | Any          |
| PUT    | /api/v1/tasks/:id   | Yes  | Owner/Admin  |
| DELETE | /api/v1/tasks/:id   | Yes  | Owner/Admin  |

## Security Features
- ✅ bcryptjs password hashing (saltRounds: 12)
- ✅ JWT Bearer token authentication
- ✅ Role-based access (user / admin)
- ✅ Input validation with express-validator
- ✅ Rate limiting (100 req / 15 min)
- ✅ CORS restricted to frontend origin
- ✅ Global error handler with environment-aware responses

## Making yourself Admin
In MongoDB shell or Compass:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```