import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 h-full min-h-[300px] flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4 font-[Poppins]">Revenue Overview (Last 7 Days)</h3>
                <div className="flex-1 flex items-center justify-center text-slate-400">
                    <p>No sales data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 font-[Poppins]">Revenue Overview (Last 7 Days)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#4f46e5" 
                            strokeWidth={4} 
                            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} 
                            dot={{ r: 0 }}
                            animationDuration={1500}
                        />
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: 'none', 
                                borderRadius: '12px',
                                color: '#fff',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
