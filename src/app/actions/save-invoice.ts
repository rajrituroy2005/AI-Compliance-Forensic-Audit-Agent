"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Define the shape of data we expect from the frontend
interface InvoiceData {
  vendorName: string;
  amount: number; // This must be a number!
  invoiceDate: Date;
  dueDate: Date;
  aiSummary: string;
  status: string;
  currency: string;
  isGstMissing: boolean;
  isRegulatoryItem: boolean;
  requiresLicense: boolean;
  complianceRiskLevel: string;
  legalImpact: string;
  userId: string;
}

export async function saveInvoice(data: InvoiceData) {
  try {
    // 1. Validate Amount (Prevent NaN errors)
    // If amount is missing or invalid, default to 0
    const finalAmount = isNaN(data.amount) ? 0 : data.amount;

    console.log("Saving Invoice for:", data.vendorName, "Amount:", finalAmount);

    // 2. Save to Database
    const newInvoice = await prisma.invoice.create({
      data: {
        userId: data.userId,
        vendorName: data.vendorName,
        amount: finalAmount, // <--- THIS WAS MISSING OR UNDEFINED BEFORE
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        aiSummary: data.aiSummary || "No summary provided", // Safety fallback
        status: data.status,
        currency: data.currency,
        isGstMissing: data.isGstMissing,
        isRegulatoryItem: data.isRegulatoryItem,
        requiresLicense: data.requiresLicense,
        complianceRiskLevel: data.complianceRiskLevel,
        legalImpact: data.legalImpact,
      },
    });

    // 3. Refresh the history page so the new data shows up immediately
    revalidatePath("/history");
    revalidatePath("/"); // Refresh dashboard too

    return { success: true, invoice: newInvoice };

  } catch (error) {
    console.error("Database Error:", error);
    throw error; // This sends the error back to the frontend so you can see it
  }
}