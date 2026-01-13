"use server";

import { prisma } from "@/lib/prisma"; // Make sure this matches your project structure

export async function saveInvoice(invoiceData: any) {
  console.log("--- 🟢 STARTING TRANSACTION SAVE (NUCLEAR FIX) ---");

  // A fixed ID to ensure consistency (Since no Clerk/Auth is active)
  const MASTER_ID = "user_master_v1";

  try {
    // We use a TRANSACTION to force 'Create User' + 'Create Invoice' to happen together.
    const result = await prisma.$transaction(async (tx) => {
      
      // STEP 1: Ensure User Exists (Using 'tx', not 'prisma')
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

      // STEP 2: Create Invoice (Linked to the User from Step 1)
      const invoice = await tx.invoice.create({
        data: {
          userId: user.id, // <--- This links them perfectly
          
          // Data from the form/AI
          amount: invoiceData.amount || 0,
          invoiceDate: new Date(invoiceData.invoiceDate || new Date()),
          dueDate: new Date(invoiceData.dueDate || new Date()),
          vendorName: invoiceData.vendorName || "Unknown Vendor",
          status: "COMPLETED",
          
          // AI Fields
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

    return { success: true, data: result };

  } catch (error) {
    console.error("❌ TRANSACTION FAILED:", error);
    throw error; 
  }
}