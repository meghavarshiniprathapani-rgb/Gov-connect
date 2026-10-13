# 🏛️ GovConnect — Unified Governance & Citizen Services Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Google Genkit & Gemini](https://img.shields.io/badge/AI-Google%20Genkit%20%2F%20Gemini-8E75C2?style=flat&logo=google)](https://firebase.google.com/docs/genkit)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GovConnect** is an enterprise-grade digital governance platform designed to bridge the gap between citizens and government administration, while simultaneously eliminating inter-departmental silos. By uniting public service delivery with secure, real-time departmental workflow orchestration and Google Gemini-powered AI assistance, GovConnect delivers transparency, operational speed, and unified public administration.

---

## 📑 Table of Contents

- [Vision & Key Highlights](#-vision--key-highlights)
- [System Architecture](#-system-architecture)
- [Core Features & Modules](#-core-features--modules)
  - [1. Citizen Services Portal](#1-citizen-services-portal)
  - [2. AI-Powered Service Discovery & Summarization](#2-ai-powered-service-discovery--summarization)
  - [3. Inter-Departmental Operations & Administration](#3-inter-departmental-operations--administration)
  - [4. Authentication & Role-Based Access Control](#4-authentication--role-based-access-control)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup (`govconnect-backend`)](#2-backend-setup-govconnect-backend)
  - [3. Frontend Setup (`gov-frontend-main`)](#3-frontend-setup-gov-frontend-main)
  - [4. Genkit AI Studio (Optional)](#4-genkit-ai-studio-optional)
- [Demo Credentials](#-demo-credentials)
- [Environment Variables](#-environment-variables)
- [REST API Reference](#-rest-api-reference)
- [Database Schema](#-database-schema)
- [Design System & UI Guidelines](#-design-system--ui-guidelines)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Vision & Key Highlights

Modern public administration faces two chronic friction points:
1. **Citizen Friction:** Fragmented public portals, confusing eligibility requirements, and lack of real-time application tracking.
2. **Administrative Silos:** Departments (Finance, Health, Transport, Legal, Municipal) operate in isolated software silos, relying on slow paper trails and disconnected email threads for cross-department approvals.

**GovConnect solves this with a two-pillar model:**
- **External Pillar (Citizen Delivery):** A centralized, intuitive service catalog with AI semantic search, direct links to official public portals (Aadhaar, Passport, Transport, Taxes, Pensions), and end-to-end status visibility.
- **Internal Pillar (Government Workspace):** A high-security administrative workspace enabling inter-departmental task assignment, formal service requests (e.g. Budget Approvals, IT Support, Policy Reviews), secure document vaults, cross-department messaging, and high-level KPI tracking.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Next.js 15 App Router)"]
        LandingPage["Landing Page (/)"]
        CitizenPortal["Public Services Portal (/services)"]
        AuthModule["Authentication (/login, /register)"]
        subgraph AdminWorkspace ["Protected Administrative Workspace (/app)"]
            Dashboard["Executive Dashboard (/app/dashboard)"]
            CommCenter["Inter-Dept Communication (/app/communication)"]
            TaskManager["Task Board (/app/tasks)"]
            DocVault["Document Vault (/app/documents)"]
            ProfilePage["Admin Profile (/app/profile)"]
        end
    end

    subgraph AILayer ["AI Layer (Google Genkit)"]
        GenkitRuntime["Genkit Framework (@genkit-ai/google-genai)"]
        GeminiModel["Google Gemini 1.5 Flash"]
        SearchFlow["aiPoweredServiceSearchFlow"]
        SummarizeFlow["intelligentDocumentAndServiceSummarizerFlow"]
    end

    subgraph BackendLayer ["Backend API Layer (Express.js)"]
        Server["Express 5 Server (:5000)"]
        AuthRoutes["/api/auth Routes"]
        AuthMiddleware["JWT Token Verifier"]
        UserModel["User Model"]
    end

    subgraph DatabaseLayer ["Data Persistence"]
        PostgresDB[("PostgreSQL Database")]
        UsersTable["users Table (Bcrypt Passwords, Roles)"]
    end

    CitizenPortal -->|Server Actions| SearchFlow
    SearchFlow --> GenkitRuntime --> GeminiModel
    DocVault -->|Summarization Actions| SummarizeFlow
    SummarizeFlow --> GenkitRuntime --> GeminiModel

    AuthModule -->|REST API /api/auth| Server
    Server --> AuthRoutes --> UserModel --> PostgresDB
    AuthRoutes --> AuthMiddleware
```

---

## 🚀 Core Features & Modules

### 1. Citizen Services Portal
- **Service Catalog (`/services`):** Comprehensive directory covering **15+ essential government services** across all major public sectors:
  - *Identity & Civil Registry:* Aadhaar Card Application (UIDAI), Birth Certificate (Municipal Corp), Voter Registration (Election Commission).
  - *Mobility & External:* Driver's License & Parivahan Services, Passport Application (MEA).
  - *Finance & Revenue:* Annual Income Tax Filing, Business Registration (Corporate Affairs), PAN / GSTIN Applications, Commercial Licensing, Export Clearance.
  - *Social Welfare & Education:* Senior Citizen Monthly Pensions, Student Scholarships & Education Grants, PMAY Housing Assistance, Public Grievance Portal (CPGRAMS).
- **Service Cards:** Clear descriptions, responsible departments, actionable deep links, and category indicators.

### 2. AI-Powered Service Discovery & Summarization
- **Semantic Natural Language Search (`search-services.tsx`):** Powered by **Google Genkit** and **Gemini 1.5 Flash**. Users describe their situation in plain conversational language (e.g., *"I need to register a new vehicle and transfer ownership"* or *"Where can my grandmother apply for monthly pension?"*), and the AI flow ranks and presents the exact relevant services.
- **Fail-Safe Fallback:** If AI API limits or network constraints occur, the system seamlessly degrades to an instantaneous, case-insensitive keyword filtering engine without breaking user experience.
- **Intelligent Document & Service Summarizer:** Genkit flow capable of condensing verbose administrative circulars and policy briefs into clear bullet points or answering natural language questions about uploaded documents.

### 3. Inter-Departmental Operations & Administration
Accessible through the protected `/app` workspace for authorized government personnel:
- **Executive Operations Dashboard (`/app/dashboard`):**
  - KPI Metrics: Pending Requests, Completed Actions, Active Department Nodes, and SLA Adherence (98.2%).
  - Real-Time Trend Analytics: Historical performance visualizations built with **Recharts**.
  - Actionable Request Tracker: Visual status badges (`Approved`, `In Progress`, `Pending Review`) with one-click report generation and notifications.
- **Formal Departmental Workflows (`/services/...`):**
  - `budget-approval`: Financial expenditure proposals, fiscal year allocation, and authorization tracking.
  - `inter-department-request`: Formal cross-agency requests with priority assignment and tracking IDs.
  - `resource-allocation`: Manpower, facility, and equipment request workflows.
  - `policy-review`: Legal and regulatory circular compliance checks.
  - `cross-dept-training`: Inter-departmental capacity building and workshop scheduling.
  - `it-support`: Government technical infrastructure and system support ticketing.
- **Task Management Board (`/app/tasks`):**
  - Cross-departmental task assignment with assignees, due dates, urgency labels (`High`, `Medium`, `Low`), and status filters (`Pending`, `In Progress`, `Completed`, `Overdue`).
  - Modal creation, inline status toggling, and audit tracking.
- **Document Vault (`/app/documents`):**
  - Digital archive with category tags, department-level classification, and file previews.
  - Upload dialog with confidentiality flags, file size indicators, and version history.
- **Inter-Department Communication (`/app/communication`):**
  - Live message threads between department representatives.
  - Public broadcast announcements for emergency circulars, pinning important threads, and filtering unread messages.
- **Official Profile & Credentials (`/app/profile`):**
  - Departmental badge ID, security clearance role, and profile editor.

### 4. Authentication & Role-Based Access Control
- **Backend Auth:** Node.js/Express REST API with `bcryptjs` salt hashing (10 rounds) and `jsonwebtoken` (JWT) authorization tokens.
- **Frontend Session Management:** Protected route layout (`AppLayout`) that verifies active sessions before unlocking the administrative hub.
- **Instant Prototype Mode:** Comes pre-configured with demo admin credentials and client-side credential persistence for instant local evaluation.

---

## 📂 Project Structure

```text
Gov-connect/
├── README.md                      # Primary project documentation (this file)
├── gov-frontend-main/             # Next.js 15 Web Application
│   ├── src/
│   │   ├── actions/               # Next.js Server Actions (AI search handler)
│   │   │   └── search.ts
│   │   ├── ai/                    # Google Genkit & Gemini Integration
│   │   │   ├── dev.ts             # Genkit local dev server configuration
│   │   │   ├── genkit.ts          # Genkit initialization with Google GenAI plugin
│   │   │   └── flows/             # AI Flow definitions
│   │   │       ├── ai-powered-service-search-flow.ts
│   │   │       └── intelligent-document-and-service-summarizer.ts
│   │   ├── app/                   # Next.js App Router Structure
│   │   │   ├── (auth)/            # Authentication Route Group
│   │   │   │   ├── login/         # Departmental login page
│   │   │   │   └── register/      # Official account registration page
│   │   │   ├── (site)/            # Public Citizen Routes
│   │   │   │   ├── page.tsx       # Landing homepage
│   │   │   │   └── services/      # Citizen & departmental services directory
│   │   │   │       ├── budget-approval/
│   │   │   │       ├── cross-dept-training/
│   │   │   │       ├── inter-department-request/
│   │   │   │       ├── it-support/
│   │   │   │       ├── policy-review/
│   │   │   │       └── resource-allocation/
│   │   │   └── app/               # Administrative Workspace (Protected)
│   │   │       ├── layout.tsx     # Session validation & security gateway
│   │   │       ├── dashboard/     # Governance metrics & charts
│   │   │       ├── communication/ # Cross-department messaging & broadcasts
│   │   │       ├── documents/     # Digital document repository
│   │   │       ├── tasks/         # Inter-department task board
│   │   │       └── profile/       # Administrative user credentials
│   │   ├── components/            # Reusable UI & Layout Components
│   │   │   ├── header.tsx         # Sticky navigation header
│   │   │   ├── footer.tsx         # Official government-style footer
│   │   │   ├── pill-nav.tsx       # GSAP-animated pill navigation
│   │   │   ├── search-services.tsx# AI search input component
│   │   │   ├── service-card.tsx   # Service catalog card
│   │   │   ├── user-nav.tsx       # User dropdown & notification drawer
│   │   │   └── ui/                # Radix UI + Tailwind components
│   │   ├── hooks/                 # Custom React hooks (useToast, etc.)
│   │   └── lib/                   # Static data catalogs, utilities, placeholder assets
│   ├── .env                       # Frontend environment configuration
│   ├── next.config.ts             # Next.js build & image optimizations
│   ├── package.json               # Frontend dependencies & scripts
│   └── tailwind.config.ts         # Design tokens & color theme configuration
│
└── govconnect-backend/            # Express.js & PostgreSQL REST Backend
    ├── config/
    │   └── db.js                  # PostgreSQL Pool connection with SSL
    ├── controllers/
    │   └── authController.js      # Register & login controller logic
    ├── middleware/
    │   └── authMiddleware.js      # JWT Bearer token authentication middleware
    ├── models/
    │   └── userModel.js           # PostgreSQL queries (findUserByEmail, createUser)
    ├── routes/
    │   └── authRoutes.js          # /api/auth endpoint routes
    ├── .env.example               # Backend environment variable template
    ├── package.json               # Backend dependencies & scripts
    └── server.js                  # Express application entrypoint
```

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 15.5](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Styling & Components** | [Tailwind CSS 3.4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), GSAP Animations |
| **Data Visualization** | [Recharts 2.15](https://recharts.org/) |
| **Artificial Intelligence** | [Google Genkit 1.28](https://firebase.google.com/docs/genkit) + [Google Gemini 1.5 Flash](https://ai.google.dev/) |
| **Backend Framework** | [Express 5.2](https://expressjs.com/) on [Node.js 18+](https://nodejs.org/) |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (accessed via Node `pg` Pool with SSL support) |
| **Form & Validation** | React Hook Form, Zod Schema Validation |

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher)
- [npm](https://www.npmjs.com/) (version `9.x` or higher)
- [PostgreSQL](https://www.postgresql.org/) (local instance or cloud database such as Render / Supabase / Neon)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) *(optional, for AI search flow)*

---

### 1. Clone Repository
```bash
git clone https://github.com/meghavarshiniprathapani-rgb/Gov-connect.git
cd Gov-connect
```

---

### 2. Backend Setup (`govconnect-backend`)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd govconnect-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Update the variables in `.env` with your PostgreSQL database connection string and desired JWT secret.*

4. Ensure your PostgreSQL database has the `users` table created:
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

5. Start the backend server:
   ```bash
   # Development mode (with nodemon reload):
   npm run dev

   # Production mode:
   npm start
   ```
   The backend server will start on `http://localhost:5000`. You can verify by visiting `http://localhost:5000/` in your browser.

---

### 3. Frontend Setup (`gov-frontend-main`)

1. Open a second terminal window and navigate to the frontend directory:
   ```bash
   cd gov-frontend-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create or verify `.env` in `gov-frontend-main/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *(Note: If `GEMINI_API_KEY` is not provided, the search gracefully falls back to instant keyword matching.)*

4. Start the frontend Next.js development server:
   ```bash
   npm run dev
   ```
   The application will run with Turbopack on port **9002**:
   **👉 Open [http://localhost:9002](http://localhost:9002) in your browser.**

---

### 4. Genkit AI Studio (Optional)
If you want to test and inspect the Google Genkit AI flows directly in the Genkit Developer UI:
```bash
cd gov-frontend-main
npm run genkit:dev
```
This launches the local Genkit Developer UI where you can test `aiPoweredServiceSearchFlow` and prompt variations.

---

## 🔑 Demo Credentials

For quick evaluation and testing of the administrative hub (`/app/dashboard`, `/app/tasks`, `/app/communication`, `/app/documents`), you can immediately log in using:

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@gov.in` | `password123` |

*Alternatively, register any new departmental official account via [http://localhost:9002/register](http://localhost:9002/register) (password requires at least 6 characters, including a letter, a number, and a special character).*

---

## ⚙️ Environment Variables

### Backend (`govconnect-backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the Express server to listen on | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/dbname` |
| `JWT_SECRET` | Secret key used for signing JWT auth tokens | `supersecretkey123` |

### Frontend (`gov-frontend-main/.env`)
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Express backend base URL | `http://localhost:5000` |
| `GEMINI_API_KEY` | Google AI Studio Gemini API Key for Genkit flows | `AIzaSy...` |

---

## 📡 REST API Reference

The backend exposes the following RESTful endpoints under `/api/auth`:

### 1. Register User
- **Route:** `POST /api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "firstName": "Arjun",
    "lastName": "Mehta",
    "email": "arjun.mehta@gov.in",
    "password": "SecurePassword@123",
    "role": "officer"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "message": "User registered",
    "user": {
      "id": 1,
      "first_name": "Arjun",
      "last_name": "Mehta",
      "email": "arjun.mehta@gov.in",
      "role": "officer"
    }
  }
  ```

---

### 2. Login User
- **Route:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "arjun.mehta@gov.in",
    "password": "SecurePassword@123"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "firstName": "Arjun",
      "role": "officer"
    }
  }
  ```

---

### 3. Server Health Check
- **Route:** `GET /`
- **Success Response (`200 OK`):**
  ```text
  🚀 GovConnect Backend Running
  ```

---

## 🗄️ Database Schema

The platform utilizes PostgreSQL. The primary entity definition is outlined below:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Extending to Full Operational Schema
For production environments, the schema can be extended to store persistent departmental tasks and requests:
```sql
CREATE TABLE service_requests (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT REFERENCES users(id),
  service_type VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(100) NOT NULL,
  assigned_to VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'In Progress',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 Design System & UI Guidelines

GovConnect adheres to strict government visual design guidelines inspired by trust, accessibility, and modern usability standards:

- **Primary Authority Hue:** Deep Navy Blue (`#1A4378` / `#1E3A8A`) — conveys security, governance, and institutional authority.
- **Accent Highlight:** State Gold / Vibrant Blue (`#C9A227` / `#4285F4`) — used for actionable call-to-actions, notifications, and navigation indicators.
- **Background Canvas:** Off-White / Crisp Neutral Slate (`#F9FAFB` / `#FFFFFF`) — ensures high-contrast legibility and reduces eye fatigue.
- **Typography:** Modern sans-serif (`Inter`) with strict typographic hierarchy from `h1` down to micro-badges.
- **Components:** Built with accessible Radix UI primitives, animated Pill navigation with GSAP physics, and responsive data tables.

---

## 🤝 Contributing

Contributions to GovConnect are welcome! To contribute:

1. **Fork** the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with clear messages:
   ```bash
   git commit -m "feat: add multi-language support toggle"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** explaining your changes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software for educational, civic, or institutional purposes.
