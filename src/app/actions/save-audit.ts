"use server";

import { prisma } from "@/lib/prisma"; 

export async function saveInvoice(invoiceData: any) {
  console.log("--- STARTING SAVE PROCESS ---");

  // 1. DEFINE THE ID IN ONE PLACE (Guarantees they match)
  // Since you don't have Auth yet, we use a fixed "Admin" ID.
  const MASTER_USER_ID = "user_master_v1"; 
  const MASTER_EMAIL = "admin@demo.com";

  try {
    // 2. FORCE CREATE THE USER (The "Safety Net")
    console.log(`Step 1: Ensuring User '${MASTER_USER_ID}' exists...`);
    
    await prisma.user.upsert({
      where: { id: MASTER_USER_ID }, // Check if this ID exists
      update: {}, // If yes, do nothing
      create: {   // If no, create it
        id: MASTER_USER_ID,
        email: MASTER_EMAIL,
        name: "System Admin",
        businessName: "My Company",
      },
    });
    console.log("✅ User ensured.");

    // 3. CREATE THE INVOICE (Using the SAME ID)
    console.log(`Step 2: Saving Invoice linked to '${MASTER_USER_ID}'...`);
    
    const newInvoice = await prisma.invoice.create({
      data: {
        // --- CRITICAL FIX: Use the variable we defined above ---
        userId: MASTER_USER_ID, 
        // -------------------------------------------------------

        amount: invoiceData.amount || 0,
        invoiceDate: new Date(invoiceData.invoiceDate || new Date()),
        dueDate: new Date(invoiceData.dueDate || new Date()),
        vendorName: invoiceData.vendorName || "Unknown Vendor",
        status: "COMPLETED",
        
        // Map your other fields...
        aiSummary: invoiceData.aiSummary || "",
        isGstMissing: Boolean(invoiceData.isGstMissing),
        isRegulatoryItem: Boolean(invoiceData.isRegulatoryItem),
        requiresLicense: Boolean(invoiceData.requiresLicense),
        complianceRiskLevel: invoiceData.complianceRiskLevel || "LOW",
        legalImpact: invoiceData.legalImpact || "None",
      },
    });

    console.log("✅ Invoice Saved Successfully:", newInvoice.id);
    return { success: true, data: newInvoice };

  } catch (error) {
    console.error("❌ DATABASE ERROR:", error);
    // Throwing error so the frontend knows it failed
    throw error; 
  }
}