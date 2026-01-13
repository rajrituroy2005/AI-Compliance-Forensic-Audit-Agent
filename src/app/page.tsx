import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import RiskChart from "@/components/RiskChart";

export default async function DashboardPage() {
  // 1. Fetch Basic Metrics
  const totalInvoices = await prisma.invoice.count();
  const highRiskCount = await prisma.invoice.count({
    where: { complianceRiskLevel: "HIGH" },
  });

  const riskValueAgg = await prisma.invoice.aggregate({
    _sum: { amount: true },
    where: { complianceRiskLevel: "HIGH" },
  });
  const potentialSavings = riskValueAgg._sum.amount || 0;

  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  // 2. PREPARE CHART DATA (Group by Month - OLD LOGIC)
  const allInvoices = await prisma.invoice.findMany({
    select: { createdAt: true, complianceRiskLevel: true },
  });

  // Helper to group data
  const chartMap = new Map();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // Static for demo simplicity

  // Initialize with 0
  months.forEach((m) => chartMap.set(m, { month: m, safe: 0, risky: 0 }));

  allInvoices.forEach((inv) => {
    const month = inv.createdAt.toLocaleString("default", { month: "short" });
    if (chartMap.has(month)) {
      const entry = chartMap.get(month);
      if (inv.complianceRiskLevel === "HIGH") entry.risky += 1;
      else entry.safe += 1;
    }
  });

  const chartData = Array.from(chartMap.values());

  // Helper for Status Colors
  const getStatusColor = (risk: string) => {
    if (risk === "HIGH") return "bg-red-50 text-red-700 border-red-200";
    if (risk === "MEDIUM") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="text-amber-500" />
              Compliance Agent
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              One Click <span className="font-semibold text-slate-700">Solution</span>
            </p>
          </div>

          <Link
            href="/upload"
            className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-1"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            New Forensic Audit
          </Link>
        </div>

        {/* --- METRICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
                <FileText size={22} />
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Scanned
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalInvoices}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
                <AlertTriangle size={22} />
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Risks
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{highRiskCount}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <ShieldCheck size={22} />
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Health
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {totalInvoices > 0
                ? Math.round(((totalInvoices - highRiskCount) / totalInvoices) * 100)
                : 100}
              %
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white text-amber-600 rounded-xl shadow-sm">
                <TrendingUp size={22} />
              </div>
              <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                Saved
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(potentialSavings)}
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA (Full Width) --- */}
        <div className="flex flex-col gap-8">
          
          {/* 1. CHART SECTION (Full Width) */}
          <RiskChart data={chartData} />

          {/* 2. RECENT ACTIVITY SECTION (Full Width) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-slate-900">
                Recent Forensic Logs
              </h3>
              <Link
                href="/history"
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 p-2 rounded-lg ${
                        inv.complianceRiskLevel === "HIGH"
                          ? "bg-red-50 text-red-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {inv.complianceRiskLevel === "HIGH" ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    <div>
                      {/* LINK TO VENDOR PROFILE */}
                      <Link
                        href={`/vendor/${encodeURIComponent(inv.vendorName || "")}`}
                        className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                      >
                        {inv.vendorName}
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        ID: {inv.id.substring(0, 8)}... •{" "}
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        inv.complianceRiskLevel || "UNKNOWN"
                      )}`}
                    >
                      {inv.complianceRiskLevel} RISK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}