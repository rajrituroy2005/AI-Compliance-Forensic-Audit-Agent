"use server";

import { prisma } from "@/lib/prisma"; // ⚠️ Check this import path (see note below)

export async function saveInvoice(invoiceData: any) {
  console.log("--- 🟢 STARTING TRANSACTION SAVE (NUCLEAR FIX) ---");

  // We use a fixed ID for now to guarantee it works without Auth
  const MASTER_ID = "user_master_v1";

  try {
    // START TRANSACTION
    // This forces Step 1 and Step 2 to happen together.
    const result = await prisma.$transaction(async (tx) => {
      
      // STEP 1: Ensure the User Exists
      // We use 'tx' (transaction client) instead of 'prisma'
      const user = await tx.user.upsert({
        where: { id: MASTER_ID },
        update: {}, 
        create: {
          id: MASTER_ID,
          email: "admin@demo.com",
          name: "System Admin",
          businessName: "Compliance Corp"
        },
      });
      console.log("✅ Step 1: User Verified ->", user.id);

      // STEP 2: Create the Invoice linked to that User
      const invoice = await tx.invoice.create({
        data: {
          userId: user.id, // <--- This is the Critical Link
          
          // Map the data from your frontend
          amount: invoiceData.amount || 0,
          invoiceDate: new Date(invoiceData.invoiceDate || new Date()),
          dueDate: new Date(invoiceData.dueDate || new Date()),
          vendorName: invoiceData.vendorName || "Unknown Vendor",
          status: "COMPLETED",
          
          // AI & Forensic Fields
          aiSummary: invoiceData.aiSummary || "",
          isGstMissing: Boolean(invoiceData.isGstMissing),
          isRegulatoryItem: Boolean(invoiceData.isRegulatoryItem),
          requiresLicense: Boolean(invoiceData.requiresLicense),
          complianceRiskLevel: invoiceData.complianceRiskLevel || "LOW",
          legalImpact: invoiceData.legalImpact || "None",
        },
      });
      console.log("✅ Step 2: Invoice Created ->", invoice.id);
      
      return invoice;
    });

    return { success: true, invoice: result };

  } catch (error) {
    console.error("❌ TRANSACTION FAILED:", error);
    // Return null so the frontend shows the error message
    throw error; 
  }
}