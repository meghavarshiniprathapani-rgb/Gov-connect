# ⚙️ GovConnect Backend API

This directory contains the Express.js and PostgreSQL REST API backend for **GovConnect**.

For full project documentation, system architecture, and frontend guides, please refer to the [Root README](../README.md).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<dbname>
JWT_SECRET=your_jwt_secret_key
```

### 3. Database Initialization
Ensure your PostgreSQL instance contains the `users` table:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Run the Backend
```bash
# Development mode (nodemon with hot reloading):
npm run dev

# Production mode:
npm start
```
The server will be available at `http://localhost:5000`.

---

## 📡 API Endpoints

- `GET /`: Health check endpoint.
- `POST /api/auth/register`: Register a new user with `firstName`, `lastName`, `email`, `password`, and `role`.
- `POST /api/auth/login`: Authenticate an existing user and receive a JWT Bearer token.
