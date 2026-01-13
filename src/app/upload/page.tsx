"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, Loader2, CheckCircle, AlertOctagon, ShieldAlert } from "lucide-react";
import { analyzeInvoice } from "@/app/actions/analyze-invoice"; 
import { saveInvoice } from "@/app/actions/save-invoice"; 

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SCANNING" | "REVIEW" | "SAVING">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  // State maps to your new AI Prompt structure
  const [formData, setFormData] = useState({
    vendorName: "",
    amount: "",
    invoiceDate: "",
    dueDate: "",
    items: "", // This will map to 'summary' from AI
    
    // Forensic Fields
    aiSummary: "",
    complianceRiskLevel: "LOW",
    legalImpact: "",
    paymentAdvice: "", // <--- Added this new field
    isGstMissing: false,
    isRegulatoryItem: false
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startRealAnalysis(e.target.files[0]);
    }
  };

  const startRealAnalysis = async (file: File) => {
    setStatus("SCANNING");
    setErrorMessage("");

    try {
      const data = new FormData();
      data.append("invoiceFile", file);

      // Call the AI Backend
      const result = await analyzeInvoice(data);

      if (result.success && result.data) {
        const aiData = result.data;

        // Map Backend JSON to Frontend State
        setFormData({
          vendorName: aiData.vendorName || "Unknown Vendor",
          amount: aiData.totalAmount ? aiData.totalAmount.toString() : "0",
          invoiceDate: aiData.invoiceDate || new Date().toISOString().split('T')[0],
          dueDate: aiData.dueDate || new Date().toISOString().split('T')[0],
          items: aiData.summary || "Detected via AI Scan", // Use summary for items
          
          aiSummary: aiData.summary || "Analysis Complete",
          complianceRiskLevel: aiData.complianceRiskLevel || "LOW",
          legalImpact: aiData.legalImpact || "No compliance issues detected.",
          paymentAdvice: aiData.paymentAdvice || "Review before paying", // Capture payment advice
          isGstMissing: aiData.isGstMissing || false,
          isRegulatoryItem: aiData.isRegulatoryItem || false
        });
        
        setStatus("REVIEW");
      } else {
        setErrorMessage("Could not read the document. Please try a clearer PDF.");
        setStatus("IDLE");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Network error. Please check your connection.");
      setStatus("IDLE");
    }
  };

  const handleSave = async () => {
    setStatus("SAVING");
    try {
        const result = await saveInvoice({
            vendorName: formData.vendorName,
            amount: parseFloat(formData.amount) || 0, 
            invoiceDate: new Date(formData.invoiceDate),
            dueDate: new Date(formData.dueDate),
            aiSummary: formData.aiSummary,
            status: "PENDING",
            currency: "INR",
            
            // Forensic Flags
            isGstMissing: formData.isGstMissing,
            isRegulatoryItem: formData.isRegulatoryItem,
            requiresLicense: false, 
            complianceRiskLevel: formData.complianceRiskLevel,
            legalImpact: formData.legalImpact, // This now holds your "Money Loss" warning
            
            userId: "12103305-ddd7-4155-aa6c-65b56766d3a4" 
        });

        if (result && result.invoice && result.invoice.id) {
            router.push(`/invoice/${result.invoice.id}`);
        } else {
            router.push("/history");
        }
    } catch (error) {
        console.error("Save failed", error);
        setErrorMessage("Database failed to save. Try again.");
        setStatus("REVIEW");
    }
  };

  // Helper for Payment Advice Colors
  const getAdviceColor = (advice: string) => {
      if (advice.includes("Safe")) return "text-emerald-700 bg-emerald-50 border-emerald-200";
      if (advice.includes("Hold")) return "text-red-700 bg-red-50 border-red-200";
      return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition font-medium">
          <ArrowLeft size={20} className="mr-2" /> Cancel & Return
        </Link>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2 border border-red-200">
            <AlertOctagon size={20} />
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="bg-slate-900 p-6 text-white">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <UploadCloud className="text-amber-400" /> Upload Invoice
            </h1>
            <p className="text-slate-400 text-sm mt-1">AI Forensic Scan</p>
          </div>

          <div className="p-8">
            {/* STATE 1: IDLE */}
            {status === "IDLE" && (
              <div 
                className={`border-3 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-amber-400 hover:bg-slate-50"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files[0]) startRealAnalysis(e.dataTransfer.files[0]);
                }}
              >
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Drag & Drop Invoice PDF</h3>
                <p className="text-slate-500 text-sm mb-6">or click to browse from device</p>
                <label className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition shadow-lg">
                  Select Document
                  <input type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            )}

            {/* STATE 2: SCANNING */}
            {status === "SCANNING" && (
              <div className="text-center py-10">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                  <Loader2 size={30} className="absolute inset-0 m-auto text-slate-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Compliance Risks...</h3>
                <p className="text-slate-500 text-sm">Validating GSTIN, HSN Codes, and Vendor History</p>
              </div>
            )}

            {/* STATE 3: REVIEW */}
            {status === "REVIEW" && (
              <div>
                {/* 1. Risk Header */}
                <div className={`p-4 rounded-lg flex items-start gap-3 text-sm mb-4 border ${
                    formData.complianceRiskLevel === "HIGH" ? "bg-red-50 border-red-200 text-red-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}>
                  <CheckCircle size={20} className="mt-0.5" />
                  <div>
                    <span className="block font-bold mb-1">Risk Level: {formData.complianceRiskLevel}</span>
                    <span className="opacity-90">{formData.legalImpact}</span>
                  </div>
                </div>

                {/* 2. Payment Advice Box (NEW) */}
                <div className={`p-3 rounded-lg flex items-center gap-3 text-sm font-bold mb-6 border ${getAdviceColor(formData.paymentAdvice)}`}>
                    <ShieldAlert size={18} />
                    <span>Advisor Recommendation: {formData.paymentAdvice}</span>
                </div>

                {/* 3. Form Data */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor Name</label>
                    <input 
                      type="text" 
                      value={formData.vendorName}
                      onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (₹)</label>
                    <input type="number" value={formData.amount} readOnly className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                    <input type="date" value={formData.invoiceDate} readOnly className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStatus("IDLE")} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-lg border border-slate-200">Discard</button>
                  <button onClick={handleSave} className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all cursor-pointer">
                    Generate Forensic Report
                  </button>
                </div>
              </div>
            )}
            
            {/* STATE 4: SAVING */}
            {status === "SAVING" && (
               <div className="text-center py-10">
                 <Loader2 size={40} className="mx-auto text-amber-500 animate-spin mb-4" />
                 <h3 className="text-lg font-bold text-slate-700">Writing to Audit Log...</h3>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}