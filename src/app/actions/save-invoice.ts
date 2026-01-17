"use server";

import { prisma } from "@/lib/prisma"; 

export async function saveInvoice(invoiceData: any) {
  const MASTER_ID = "user_master_v1";

  try {
    // 1. Ensure User Exists (Wait for this to finish)
    // We remove 'tx' and just use 'prisma' directly
    const user = await prisma.user.upsert({
      where: { id: MASTER_ID },
      update: {}, 
      create: {
        id: MASTER_ID,
        email: "admin@demo.com",
        name: "System Admin",
        businessName: "Compliance Corp"
      },
    });

    // 2. Create Invoice (Now safe to run)
    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        
        // Ensure Amount is a Number
        amount: parseFloat(invoiceData.amount) || 0, 
        
        invoiceDate: new Date(invoiceData.invoiceDate || new Date()),
        dueDate: new Date(invoiceData.dueDate || new Date()),
        vendorName: invoiceData.vendorName || "Unknown Vendor",
        status: "COMPLETED",
        
        // Forensic Fields
        aiSummary: invoiceData.aiSummary || "",
        isGstMissing: Boolean(invoiceData.isGstMissing),
        isRegulatoryItem: Boolean(invoiceData.isRegulatoryItem),
        requiresLicense: Boolean(invoiceData.requiresLicense),
        complianceRiskLevel: invoiceData.complianceRiskLevel || "LOW",
        legalImpact: invoiceData.legalImpact || "None",
      },
    });

    return { success: true, invoice };

  } catch (error) {
    console.error("❌ SAVE FAILED:", error);
    throw error; 
  }
}