"use server";

import { prisma } from "@/lib/prisma"; // Adjust path to your prisma client
import { revalidatePath } from "next/cache";

// 1. Delete a Single Invoice
export async function deleteInvoice(invoiceId: string) {
  try {
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
    revalidatePath("/history"); // Refreshes the UI automatically
    return { success: true, message: "Invoice deleted" };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return { success: false, message: "Failed to delete invoice" };
  }
}

// 2. Delete All History (Clear All)
export async function clearAllHistory(userId: string) {
  try {
    await prisma.invoice.deleteMany({
      where: {
        userId: userId, // Only delete THIS user's data
      },
    });
    revalidatePath("/history");
    return { success: true, message: "All history cleared" };
  } catch (error) {
    console.error("Failed to clear history:", error);
    return { success: false, message: "Failed to clear history" };
  }
}