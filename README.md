# EIVA AI — Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configure Backend

```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Run Development Servers

**Terminal 1 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd backend
node server.js
# → http://localhost:4000
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Routing | React Router v7 |
| Backend | Node.js + Express |
| AI Layer | LLM-agnostic (Gemini/OpenAI ready) |

---

## 📦 Project Structure

```
eiva-ai/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   └── tools/
│   │   │       ├── ATSCheckerPage.tsx
│   │   │       ├── InterviewQGenPage.tsx
│   │   │       ├── MockInterviewPage.tsx
│   │   │       ├── LinkedInOptimizerPage.tsx
│   │   │       └── EmailGeneratorPage.tsx
│   │   └── index.css         # Global design system
│   └── vite.config.ts
└── backend/
    ├── server.js             # All API routes
    └── .env.example          # Config template
```

---

## 🔌 Adding Real AI (TODO)

Each backend endpoint has a `// TODO` comment showing where to drop in LLM calls.

**Example — ATS Checker (`server.js` line ~30):**
```js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Replace mock response with:
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent(`Analyze this resume for ${jobRole}: ${resumeText}`);
```

---

## 🛣️ Routes

| Page | Path |
|---|---|
| Landing | `/` |
| All Products | `/products` |
| ATS Checker | `/tools/ats-checker` |
| Interview Questions | `/tools/interview-questions` |
| Mock Interview | `/tools/mock-interview` |
| LinkedIn Optimizer | `/tools/linkedin-optimizer` |
| Email Generator | `/tools/email-generator` |
