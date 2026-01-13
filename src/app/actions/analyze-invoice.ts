"use server";

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// 1. Define the Strict Schema
const InvoiceSchema = z.object({
  vendorName: z.string().describe('Name of the vendor'),
  totalAmount: z.number().describe('Total invoice amount. Remove currency symbols.'),
  invoiceDate: z.string().describe('YYYY-MM-DD'),
  dueDate: z.string().describe('YYYY-MM-DD. If missing, add 30 days to invoice date.'),
  
  // Risk Flags
  isGstMissing: z.boolean().describe('True if GSTIN is completely missing'),
  isRegulatoryItem: z.boolean().describe('True for chemicals, hazardous goods, or restricted items'),
  complianceRiskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  
  // The "Human" Business Advice
  summary: z.string().describe('Short 10-word summary of goods'),
  legalImpact: z.string().describe('A direct warning about money/tax credit loss. Do not quote section numbers.'),
  paymentAdvice: z.string().describe('Short action: "Safe to Pay" or "STOP PAYMENT"'),
});

export async function analyzeInvoice(formData: FormData) {
  try {
    const file = formData.get('invoiceFile') as File;
    if (!file) return { success: false, error: "No file uploaded" };

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    // 2. The "Business Advisor" Prompt
    const result = await generateObject({
      model: google('gemini-3-flash-preview'), // Ensure you use 1.5-flash
      schema: InvoiceSchema,
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `You are an expert Forensic Audit AI acting as a trusted business advisor for an MSME owner.
Analyze the provided invoice image or PDF carefully.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON.
- Do NOT include markdown, explanations, or extra text.
- If information is missing or unclear, make a best judgment and reflect risk appropriately.

FIELDS TO EXTRACT:
- vendorName: string | null
- totalAmount: number | null
- invoiceDate: string | null (YYYY-MM-DD)
- dueDate: string | null (YYYY-MM-DD)
- summary: string (max 15 words, plain business language)

RISK LOGIC (STRICT RULES):
- isGstMissing: boolean  
  True if GSTIN / Tax ID is completely absent.

- isRegulatoryItem: boolean  
  True if invoice includes chemicals, hazardous goods, restricted items,
  or unusually high-value machinery.

- complianceRiskLevel: "LOW" | "MEDIUM" | "HIGH"
  - HIGH if GST is missing OR regulatory items are present.
  - MEDIUM if information is incomplete or suspicious.
  - LOW only if everything appears compliant.

LEGAL IMPACT (VERY IMPORTANT):
- legalImpact: string
- Do NOT mention law sections or legal jargon.
- Speak ONLY in terms of money, loss, or business risk.
- Example:
  "Vendor GST number is missing. Paying this invoice will cause loss of input tax credit."

PAYMENT ADVICE:
- paymentAdvice: string
- Must be one of:
  - "Safe to pay"
  - "Hold payment - Request valid invoice"
  - "High risk - Review before payment"
` 
            },
            { type: 'image', image: dataUrl }
          ],
        },
      ],
    });

    return { success: true, data: result.object };

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return { success: false, error: "Failed to analyze invoice" };
  }
}

//gemini-3-flash-preview