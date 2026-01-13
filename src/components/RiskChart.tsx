"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RiskChart({ data }: { data: any[] }) {
  // If no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-400 text-sm">Upload invoices to generate risk trends</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800">Compliance Risk Timeline</h3>
        <p className="text-xs text-slate-500">High Risk vs. Safe Invoices (Last 6 Months)</p>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barSize={40}>
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="safe" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} name="Safe Invoices" />
          <Bar dataKey="risky" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="High Risk" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}