import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, Building2, ShieldAlert, ShieldCheck, 
  TrendingUp, FileText, Calendar 
} from "lucide-react";

type Props = {
  params: Promise<{ name: string }> | { name: string };
};

export default async function VendorProfilePage({ params }: Props) {
  // 1. Decode the Vendor Name from URL (e.g., "Shree%20Ganesh" -> "Shree Ganesh")
  const resolvedParams = await params;
  const vendorName = decodeURIComponent(resolvedParams.name);

  // 2. Fetch ALL invoices for this specific vendor
  const invoices = await prisma.invoice.findMany({
    where: { vendorName: vendorName },
    orderBy: { invoiceDate: 'desc' }
  });

  if (invoices.length === 0) return notFound();

  // 3. Perform Forensic Calculations
  const totalSpend = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const highRiskCount = invoices.filter(inv => inv.complianceRiskLevel === "HIGH").length;
  const trustScore = Math.max(0, 100 - (highRiskCount * 25)); // Simple logic: -25% per violation

  // Determine Vendor Grade
  let grade = "A";
  let gradeColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (trustScore < 80) { grade = "B"; gradeColor = "text-amber-600 bg-amber-50 border-amber-200"; }
  if (trustScore < 50) { grade = "C"; gradeColor = "text-orange-600 bg-orange-50 border-orange-200"; }
  if (trustScore < 30) { grade = "F"; gradeColor = "text-red-600 bg-red-50 border-red-200"; }

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Navigation */}
        <Link href="/history" className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition font-medium w-fit">
          <ArrowLeft size={20} className="mr-2" /> Back to Database
        </Link>

        {/* --- VENDOR HEADLINE CARD --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                <Building2 size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{vendorName}</h1>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <FileText size={14} /> {invoices.length} Documents Tracked
                </p>
              </div>
            </div>

            {/* Trust Grade Badge */}
            <div className={`px-6 py-3 rounded-xl border-2 flex flex-col items-center min-w-[120px] ${gradeColor}`}>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Trust Grade</span>
              <span className="text-4xl font-black">{grade}</span>
            </div>
          </div>
        </div>

        {/* --- FORENSIC METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Total Exposure */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
              <TrendingUp size={18} /> <span className="text-xs font-bold uppercase">Total Spend</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalSpend)}
            </div>
          </div>

          {/* Card 2: Risk Incidents */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
              <ShieldAlert size={18} /> <span className="text-xs font-bold uppercase">Compliance Strikes</span>
            </div>
            <div className={`text-2xl font-bold ${highRiskCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
              {highRiskCount} <span className="text-sm font-normal text-slate-400">High Risk Events</span>
            </div>
          </div>

          {/* Card 3: Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
              <ShieldCheck size={18} /> <span className="text-xs font-bold uppercase">Forensic Status</span>
            </div>
            <div className="text-lg font-bold text-slate-900">
              {highRiskCount > 0 ? "⚠️ Under Watch" : "✅ Verified Partner"}
            </div>
          </div>
        </div>

        {/* --- TRANSACTION HISTORY --- */}
        <h3 className="text-xl font-bold text-slate-900 mb-4">Audit Timeline</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="p-4 border-b border-slate-100">Date</th>
                <th className="p-4 border-b border-slate-100">Invoice Amount</th>
                <th className="p-4 border-b border-slate-100">Risk Level</th>
                <th className="p-4 border-b border-slate-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(inv.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-slate-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inv.amount)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      inv.complianceRiskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {inv.complianceRiskLevel}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/invoice/${inv.id}`} className="text-sm font-bold text-blue-600 hover:underline">
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}