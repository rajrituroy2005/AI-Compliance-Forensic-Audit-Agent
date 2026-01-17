"use server";

import { prisma } from "@/lib/prisma"; 
import { revalidatePath } from "next/cache";

// The same fixed ID used in save-invoice.ts
const MASTER_ID = "user_master_v1";

// 1. Delete a Single Invoice
export async function deleteInvoice(invoiceId: string) {
  try {
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
    revalidatePath("/history"); 
    return { success: true, message: "Invoice deleted" };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return { success: false, message: "Failed to delete invoice" };
  }
}

// 2. Delete All History (Clear All)
// We removed the 'userId' argument because we MUST use the MASTER_ID
export async function clearAllHistory() {
  try {
    await prisma.invoice.deleteMany({
      where: {
        userId: MASTER_ID, // <--- Targeted Fix
      },
    });
    revalidatePath("/history");
    return { success: true, message: "All history cleared" };
  } catch (error) {
    console.error("Failed to clear history:", error);
    return { success: false, message: "Failed to clear history" };
  }
}