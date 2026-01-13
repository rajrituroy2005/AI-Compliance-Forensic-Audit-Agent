

import { prisma } from "@/lib/prisma"; // The file we just fixed
import HistoryTable from "@/components/HistoryTable"; // Or wherever your client component is
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// If HistoryTable is defined in this same file, just separate them.

export default async function HistoryPage() {
  // 1. Fetch data from Database
  const invoices = await prisma.invoice.findMany({
    orderBy: {
      createdAt: 'desc', // Sort by newest first
    },
  });

  // 2. Hardcode a User ID for now (since we don't have auth setup yet)
  const userId = "12103305-ddd7-4155-aa6c-65b56766d3a4"; 

  // 3. Pass data to the Client Component
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Audit History</h1>
      {/* --- NEW BACK BUTTON --- */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
      
      {/* Pass the data here! */}
      <HistoryTable invoices={invoices} userId={userId} />
    </div>
  );
}