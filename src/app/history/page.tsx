export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma"; 
import HistoryTable from "@/components/HistoryTable"; 
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function HistoryPage() {
  // 1. Define the Master ID (Must match the one in save-invoice.ts)
  const MASTER_ID = "user_master_v1";

  // 2. Fetch invoices ONLY for this user
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: MASTER_ID, // <--- Crucial filter to see the right data
    },
    orderBy: {
      createdAt: 'desc', 
    },
  });

  // 3. Render the Page
  return (
    <div className="min-h-screen bg-[#fafaf9] p-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        {/* FIX: Removed 'userId={...}' because HistoryTable doesn't need it anymore */}
        <HistoryTable invoices={invoices} />
      </div>
    </div>
  );
}