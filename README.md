# 🛡️ AI Compliance Agent & Forensic Audit Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)

A robust, AI-driven SaaS platform designed to automate forensic audits, assess vendor compliance risks, and streamline invoice processing. This application provides real-time dashboards, risk visualization, and "One-Click" audit solutions for businesses.
A production-focused, AI-enabled compliance and forensic intelligence platform for modern finance and procurement operations. This project helps organizations detect invoice risk, monitor vendor compliance posture, and accelerate internal audit workflows through a unified, data-rich interface.

## 🚀 Features
---

## 📘 Executive Overview

The **AI Compliance Agent & Forensic Audit Platform** is designed for teams that need stronger governance across invoices, vendors, and operational controls. Instead of fragmented manual checks, the system provides:

### 📊 Interactive Dashboard
- **Real-time Metrics:** Instant view of total invoices scanned, high-risk alerts, overall health score, and potential cost savings.
- **Dynamic Visualizations:** Interactive charts powered by `Recharts` to track risk trends and financial data over time.
- **Recent Activity:** Live feed of recent forensic logs with vendor details and risk levels.
- **Centralized forensic visibility** into risk signals and compliance status.
- **Automated risk triage** for invoice and vendor records.
- **Operational dashboards** that translate raw data into decision-grade insight.
- **Scalable architecture** aligned with modern Next.js and Prisma workflows.

This enables audit, finance, and compliance stakeholders to move from reactive controls to proactive risk management.

---

## 🚀 Core Capabilities

### 📊 Command Dashboard
- **Real-time KPI monitoring** for scanned invoices, alert counts, health score, and opportunity savings.
- **Trend visualization** using interactive charting to analyze risk drift and transaction movement.
- **Forensic activity stream** to review latest events, risk labels, and vendor-level findings.

### 🔍 Forensic Audit Engine
- **Automated Risk Assessment:** AI-driven classification of vendors/invoices into **HIGH**, **MEDIUM**, and **LOW** risk categories.
- **Vendor Profiling:** Dedicated pages for detailed vendor history and compliance scores.
- **Invoice Scanning:** Support for PDF uploads and data extraction (OCR/AI analysis).
- **Automated risk classification** with support for **HIGH / MEDIUM / LOW** severity tiers.
- **Vendor intelligence views** with history, profile context, and compliance scoring support.
- **Document ingestion pipeline** for invoice uploads (including PDF-oriented workflows).

### 🤖 AI-Assisted Compliance Workflows
- **Rule + AI hybrid decisioning** to enhance classification confidence.
- **Signal-driven prioritization** so reviewers focus on material findings first.
- **Extensible integration model** to support future policy packs and vertical-specific controls.

### 🛠️ Technical Highlights
- **Server Actions:** deeply integrated Next.js 14 Server Actions for seamless backend logic.
- **Database Optimization:** Efficient querying using Prisma ORM with PostgreSQL.
- **Responsive UI:** Mobile-first design using Tailwind CSS and Lucide Icons.
### 🛠️ Engineering Foundations
- **Next.js 14 App Router + Server Actions** for streamlined full-stack behavior.
- **Prisma + PostgreSQL** for robust relational data modeling and query safety.
- **Tailwind CSS + reusable components** for responsive and maintainable UI development.

---

## 💻 Tech Stack
## 🧱 Technology Stack

| Category | Technology |
| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Application Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | Lucide React |
| **UI Icons / Components** | Lucide React + reusable component modules |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **AI / Logic** | Gemini API KEY / Custom AI Logic |
| **ORM / Data Access** | [Prisma](https://www.prisma.io/) |
| **Charts / Analytics UI** | [Recharts](https://recharts.org/) |
| **AI Integration** | Gemini API key + custom compliance logic |
| **Utilities** | `date-fns`, `clsx`, `tailwind-merge` |

---

## ⚙️ Environment Variables

To run this project efficiently, you will need to add the following environment variables to your `.env` file:
Create a `.env` file in the project root and provide the required values:

```bash
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# App Configuration
# Public Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: AI Integration
# GEMINI_API_KEY="your_key_here"
```

---
> ✅ Recommendation: use separate credentials and URLs per environment (`development`, `staging`, `production`).

## 📦 Getting Started
---

Follow these steps to set up the project locally.
## 📦 Local Setup & Runbook

### 1. Clone the Repository
### 1) Clone the repository

```bash
git clone [https://github.com/your-username/compliance-agent.git](https://github.com/rajrituroy2005/compliance-agent.git)
git clone https://github.com/rajrituroy2005/compliance-agent.git
cd compliance-agent

```

### 2. Install Dependencies
### 2) Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install

```

### 3. Setup Database
### 3) Prepare the database

Ensure you have a PostgreSQL instance running, then generate the Prisma client.
Ensure PostgreSQL is running, then initialize Prisma artifacts:

```bash
npx prisma generate
npx prisma db push

```

### 4. Run the Development Server
### 4) Start the development server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.
Visit: [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure
## 🗂️ Project Structure

```text
├── actions/             # Server actions (Backend logic)
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn primitive components
│   └── ...              # Custom project components (RiskChart, etc.)
├── lib/                 # Utility functions (db.ts, utils.ts)
├── prisma/              # Database schema
├── actions/             # Server Actions and backend workflows
├── app/                 # Next.js App Router routes and layouts
├── components/          # Shared UI building blocks
│   ├── ui/              # Primitive/reusable UI components
│   └── ...              # Domain components (e.g., dashboards/charts)
├── lib/                 # Utility modules, helpers, and data clients
├── prisma/              # Prisma schema and database definitions
├── public/              # Static assets
└── styles/              # Global styles

└── styles/              # Global and shared style resources
```

## 🤝 Contributing
---

Contributions are welcome! Please follow these steps:
## 🔐 Security & Compliance Notes

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
- Never commit `.env` files or production secrets.
- Enforce least-privilege database credentials per environment.
- Validate uploaded document content and file type constraints.
- Add audit logging for high-risk actions and admin workflows.

## 📄 License
---

Distributed under the MIT License. See `LICENSE` for more information.
## 🧪 Quality & Operational Recommendations

```
For professional deployments, consider integrating:

```
- CI pipelines for linting, build validation, and type checks.
- Database migration governance (`prisma migrate`) for controlled schema changes.
- Observability stack (logs, traces, alerts) for compliance-grade monitoring.
- Policy and rule versioning for explainable audit outcomes.

---

## 🤝 Contributing

Contributions are welcome and appreciated.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes with clear messages.
4. Push your branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request with implementation notes and test evidence.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
