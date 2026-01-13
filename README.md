# 🛡️ AI Compliance Agent & Forensic Audit Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)

A robust, AI-driven SaaS platform designed to automate forensic audits, assess vendor compliance risks, and streamline invoice processing. This application provides real-time dashboards, risk visualization, and "One-Click" audit solutions for businesses.

## 🚀 Features

### 📊 Interactive Dashboard
- **Real-time Metrics:** Instant view of total invoices scanned, high-risk alerts, overall health score, and potential cost savings.
- **Dynamic Visualizations:** Interactive charts powered by `Recharts` to track risk trends and financial data over time.
- **Recent Activity:** Live feed of recent forensic logs with vendor details and risk levels.

### 🔍 Forensic Audit Engine
- **Automated Risk Assessment:** AI-driven classification of vendors/invoices into **HIGH**, **MEDIUM**, and **LOW** risk categories.
- **Vendor Profiling:** Dedicated pages for detailed vendor history and compliance scores.
- **Invoice Scanning:** Support for PDF uploads and data extraction (OCR/AI analysis).

### 🛠️ Technical Highlights
- **Server Actions:** deeply integrated Next.js 14 Server Actions for seamless backend logic.
- **Database Optimization:** Efficient querying using Prisma ORM with PostgreSQL.
- **Responsive UI:** Mobile-first design using Tailwind CSS and Lucide Icons.

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | Lucide React |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **AI / Logic** | Gemini API KEY / Custom AI Logic |
| **Utilities** | `date-fns`, `clsx`, `tailwind-merge` |

---

## ⚙️ Environment Variables

To run this project efficiently, you will need to add the following environment variables to your `.env` file:

```bash
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

---

## 📦 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/compliance-agent.git](https://github.com/rajrituroy2005/compliance-agent.git)
cd compliance-agent

```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install

```

### 3. Setup Database

Ensure you have a PostgreSQL instance running, then generate the Prisma client.

```bash
npx prisma generate
npx prisma db push

```

### 4. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```text
├── actions/             # Server actions (Backend logic)
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn primitive components
│   └── ...              # Custom project components (RiskChart, etc.)
├── lib/                 # Utility functions (db.ts, utils.ts)
├── prisma/              # Database schema
├── public/              # Static assets
└── styles/              # Global styles

```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```

```
