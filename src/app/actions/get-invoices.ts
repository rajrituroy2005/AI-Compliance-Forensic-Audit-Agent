"use server";

import { prisma } from "@/lib/prisma";

export async function getInvoices() {
  // 1. MUST MATCH THE ID USED IN 'save-invoice.ts'
  const MASTER_ID = "user_master_v1";

  try {
    // 2. Fetch invoices ONLY for this Master User
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: MASTER_ID, // <--- This ensures we find what we just saved
      },
      orderBy: {
        createdAt: "desc", // Show newest uploads first
      },
      // Include the User relation if needed (optional)
      include: {
        user: true, 
      }
    });

    return { success: true, data: invoices };

  } catch (error) {
    console.error("Failed to fetch history:", error);
    return { success: false, data: [] };
  }
}