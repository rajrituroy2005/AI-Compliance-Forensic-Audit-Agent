'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getInvoices() {
  try {
    // 1. Fetch invoices and include the related User info
    // We order by 'createdAt' descending (newest first)
    const invoices = await prisma.invoice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true, // Also get the user details if needed
      }
    });

    return { success: true, data: invoices };

  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return { success: false, error: "Failed to load history" };
  }
}