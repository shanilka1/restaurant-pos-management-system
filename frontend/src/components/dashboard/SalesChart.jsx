import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 p-6 h-full min-h-[300px] flex flex-col">
                <h3 className="text-lg font-extrabold text-amber-400 mb-4 font-[Poppins]">Revenue Overview (Last 7 Days)</h3>
                <div className="flex-1 flex items-center justify-center text-slate-400 font-semibold">
                    <p>No sales data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 p-6">
            <h3 className="text-lg font-extrabold text-amber-400 mb-6 font-[Poppins]">Revenue Overview (Last 7 Days)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#f59e0b" 
                            strokeWidth={4} 
                            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} 
                            dot={{ r: 4, fill: '#f59e0b' }}
                            animationDuration={1500}
                        />
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 'bold' }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 'bold' }}
                            tickFormatter={(value) => `$${value}`}
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0f172a', 
                                border: '1px solid rgba(245, 158, 11, 0.4)', 
                                borderRadius: '12px',
                                color: '#fff',
                                boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.5)'
                            }}
                            itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
