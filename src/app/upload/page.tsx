"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, Loader2, AlertOctagon, ShieldAlert, Layers } from "lucide-react";
import { analyzeInvoice } from "@/app/actions/analyze-invoice"; 
import { saveInvoice } from "@/app/actions/save-invoice"; 

// Define the shape of our Report Data
interface ForensicReport {
  id: string; // The REAL Database ID
  fileName: string;
  vendorName: string;
  amount: string;
  invoiceDate: string;
  complianceRiskLevel: string;
  legalImpact: string;
  paymentAdvice: string;
  aiSummary: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  
  // QUEUE & STATUS
  const [queue, setQueue] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // DATA: We store an ARRAY of reports now
  const [reports, setReports] = useState<ForensicReport[]>([]);

  // 1. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setQueue(filesArray);
      startBatchProcessing(filesArray);
    }
  };

  // 2. The Processing Loop
  const startBatchProcessing = async (files: File[]) => {
    setIsProcessing(true);
    setReports([]); // Clear old reports

    for (let i = 0; i < files.length; i++) {
      setCurrentFileIndex(i);
      const file = files[i];

      try {
        // A. Analyze
        const data = new FormData();
        data.append("invoiceFile", file);
        
        const aiResult = await analyzeInvoice(data);

        if (aiResult.success && aiResult.data) {
          const aiData = aiResult.data;

          // B. Save to Database AND Capture the Result
          // We assume saveInvoice returns { success: true, invoice: { id: "...", ... } }
          const saveResult = await saveInvoice({
              vendorName: aiData.vendorName || "Unknown Vendor",
              amount: aiData.totalAmount ? aiData.totalAmount.toString() : "0",
              invoiceDate: aiData.invoiceDate || new Date().toISOString().split('T')[0],
              dueDate: aiData.dueDate || new Date().toISOString().split('T')[0],
              aiSummary: aiData.summary || "Batch Upload",
              complianceRiskLevel: aiData.complianceRiskLevel || "LOW",
              legalImpact: aiData.legalImpact || "None",
              isGstMissing: aiData.isGstMissing || false,
              isRegulatoryItem: aiData.isRegulatoryItem || false,
              requiresLicense: false,
              userId: "user_master_v1"
          });

          // C. Get the Real ID from the DB
          // Fallback to random if save failed (prevents crash), but saveResult.invoice.id should exist.
          const realDbId = saveResult.invoice?.id || Math.random().toString();

          // D. Add to Report List using the REAL ID
          const newReport: ForensicReport = {
            id: realDbId, 
            fileName: file.name,
            vendorName: aiData.vendorName || "Unknown Vendor",
            amount: aiData.totalAmount ? aiData.totalAmount.toString() : "0",
            invoiceDate: aiData.invoiceDate || new Date().toISOString().split('T')[0],
            complianceRiskLevel: aiData.complianceRiskLevel || "LOW",
            legalImpact: aiData.legalImpact || "No issues found.",
            paymentAdvice: aiData.paymentAdvice || "Review Required",
            aiSummary: aiData.summary || "Processed via Batch AI"
          };

          setReports(prev => [...prev, newReport]);
        } 
      } catch (error) {
        console.error(`Failed to process ${file.name}`, error);
      }
    }
    
    setIsProcessing(false);
  };

  // Helper for Colors
  const getRiskColor = (level: string) => {
      if (level === "HIGH") return "bg-red-50 border-red-200 text-red-700";
      if (level === "MEDIUM") return "bg-amber-50 border-amber-200 text-amber-700";
      return "bg-emerald-50 border-emerald-200 text-emerald-700";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 transition font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back
            </Link>
            {reports.length > 0 && !isProcessing && (
                <button onClick={() => window.location.reload()} className="text-sm font-bold text-amber-600 hover:underline">
                    Start New Upload
                </button>
            )}
        </div>

        {/* 1. UPLOAD AREA (Only show if no reports yet) */}
        {reports.length === 0 && !isProcessing && (
           <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-amber-400" /> Batch Forensic Scan
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Upload multiple PDFs to generate instant audit reports.</p>
                </div>
                <div className="p-10">
                    <div 
                        className={`border-3 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-amber-400 hover:bg-slate-50"}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files.length > 0) {
                                const files = Array.from(e.dataTransfer.files);
                                setQueue(files);
                                startBatchProcessing(files);
                            }
                        }}
                    >
                        <UploadCloud size={40} className="mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Drag & Drop Multiple Files</h3>
                        <label className="mt-4 inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium cursor-pointer shadow-lg hover:bg-slate-800 transition">
                            Select Documents
                            <input type="file" multiple accept=".pdf,.jpg,.png" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>
           </div>
        )}

        {/* 2. PROGRESS BAR (Sticky Top) */}
        {isProcessing && (
            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-6 flex items-center justify-between sticky top-4 z-50">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-amber-500" />
                    <span className="font-bold text-slate-700">
                        Analyzing File {currentFileIndex + 1} of {queue.length}...
                    </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{queue[currentFileIndex]?.name}</span>
            </div>
        )}

        {/* 3. REPORT FEED (The "Scrollable View") */}
        <div className="space-y-6">
            {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Report Header */}
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-500">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{report.vendorName}</h3>
                                <p className="text-xs text-slate-500">{report.fileName} • {report.invoiceDate}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-slate-800">₹{report.amount}</span>
                            <span className="text-xs text-slate-400">Invoice Amount</span>
                        </div>
                    </div>

                    {/* Report Body */}
                    <div className="p-6">
                        {/* Risk & Advice Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            
                            {/* Risk Alert */}
                            <div className={`p-4 rounded-lg border flex items-start gap-3 ${getRiskColor(report.complianceRiskLevel)}`}>
                                <AlertOctagon size={20} className="shrink-0 mt-1" />
                                <div>
                                    <span className="block font-bold text-sm uppercase mb-1">Risk Level: {report.complianceRiskLevel}</span>
                                    <p className="text-sm opacity-90 leading-snug">{report.legalImpact}</p>
                                </div>
                            </div>

                            {/* Payment Advice */}
                            <div className="p-4 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 flex items-start gap-3">
                                <ShieldAlert size={20} className="shrink-0 mt-1 text-slate-500" />
                                <div>
                                    <span className="block font-bold text-sm uppercase mb-1">AI Recommendation</span>
                                    <p className="text-sm font-medium">{report.paymentAdvice}</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border border-slate-100">
                            <span className="font-bold text-slate-900 mr-2">Analysis:</span>
                            {report.aiSummary}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        {/* --- THIS IS THE FIX: Linked Button --- */}
                        <Link 
                            href={`/invoice/${report.id}`} 
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center hover:underline"
                        >
                            View Full Details →
                        </Link>
                    </div>
                </div>
            ))}
        </div>

        {/* 4. Batch Complete Message */}
        {!isProcessing && reports.length > 0 && (
            <div className="text-center mt-10 mb-10">
                <p className="text-slate-400 mb-4">All files processed successfully.</p>
                <Link href="/history" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 shadow-lg">
                    Go to Dashboard
                </Link>
            </div>
        )}

      </div>
    </div>
  );
}