# 🌐 GovConnect Frontend

This directory contains the Next.js 15 frontend application for **GovConnect**, built with React 19, TypeScript, Tailwind CSS, Radix UI, GSAP, and Google Genkit (Gemini 1.5 Flash).

For complete platform documentation, architecture diagrams, and backend setup instructions, please see the [Root README](../README.md).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env` in this directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack on port `9002`.
- `npm run build`: Compiles and builds the production bundle.
- `npm run start`: Starts the Next.js production server.
- `npm run genkit:dev`: Starts the Genkit AI Developer UI (`src/ai/dev.ts`).
- `npm run lint`: Runs ESLint to check for code quality and formatting.
- `npm run typecheck`: Runs the TypeScript compiler check (`tsc --noEmit`).

---

## 📁 Directory Overview

- `src/app/(site)`: Public citizen routes (`/` homepage, `/services` catalog and workflows).
- `src/app/(auth)`: Official login and registration pages (`/login`, `/register`).
- `src/app/app`: Administrative workspace (`/app/dashboard`, `/app/tasks`, `/app/communication`, `/app/documents`, `/app/profile`).
- `src/ai`: Google Genkit flows for natural language service search and document summarization.
- `src/actions`: Next.js Server Actions connecting the UI to Genkit flows.
- `src/components`: UI components (GSAP-powered `PillNav`, `Header`, `Footer`, `UserNav`, Radix UI primitives).
