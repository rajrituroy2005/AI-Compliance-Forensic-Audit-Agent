"use client";

import { deleteInvoice, clearAllHistory } from "@/app/actions/manage-history";
import { Trash2, AlertTriangle, FileText, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Helper function for Risk Colors
const getRiskBadge = (level: string) => {
  switch (level) {
    case "LOW":
      return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">Low Risk</span>;
    case "MEDIUM":
      return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-200">Medium Risk</span>;
    case "HIGH":
      return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold border border-red-200">High Risk</span>;
    default:
      return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">Unknown</span>;
  }
};

export default function HistoryTable({ invoices = [] }: { invoices: any[] }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    setIsDeleting(true);
    await deleteInvoice(id);
    setIsDeleting(false);
  };

  const handleClearAll = async () => {
    if (!confirm("WARNING: This will delete ALL your invoice history. This cannot be undone.")) return;
    setIsDeleting(true);
    
    // Updated: No longer needs arguments, it knows which User ID to wipe
    await clearAllHistory(); 
    
    setIsDeleting(false);
  };

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <FileText className="text-gray-400 w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Invoices Found</h3>
        <p className="text-gray-500 mt-1">Upload an invoice to see the compliance analysis here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Compliance History</h2>
          <p className="text-sm text-gray-500">Track and manage your analyzed documents</p>
        </div>
        
        <button 
          onClick={handleClearAll}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 size={16} />
          Clear History
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Risk Level</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    <td className="px-6 py-4 font-medium text-gray-900">
                    {/* The Link to the details page */}
                    <Link 
                        href={`/invoice/${inv.id}`} 
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                    >
                        {inv.vendorName || "Unknown Vendor"}
                        <FileText size={14} className="opacity-50" />
                    </Link>
                    </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(inv.invoiceDate).toLocaleDateString("en-IN", {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inv.amount)}
                  </td>

                  {/* Risk Badge */}
                  <td className="px-6 py-4">
                    {getRiskBadge(inv.complianceRiskLevel || "UNKNOWN")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(inv.id)}
                      disabled={isDeleting}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Invoice"
                    >
                      <Trash2 size={18} />
                    </button>
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