import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

export default function OrderFilters({ filters, setFilters, onSearch }) {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        customerService.getAll({ per_page: 200 })
            .then(res => setCustomers(res.data.data))
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 mb-6">
            <input
                type="text"
                name="search"
                placeholder="Search Order ID..."
                value={filters.search || ''}
                onChange={handleChange}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all max-w-[150px]"
            />

            <select 
                name="customer_id" 
                value={filters.customer_id || ''} 
                onChange={handleChange}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all max-w-[200px]"
            >
                <option value="">All Customers</option>
                {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            
            <select 
                name="status" 
                value={filters.status || ''} 
                onChange={handleChange}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all max-w-[180px]"
            >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>

            <input
                type="date"
                name="date"
                value={filters.date || ''}
                onChange={handleChange}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all max-w-[160px]"
            />

            <button 
                type="submit"
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all text-sm"
            >
                Filter
            </button>
        </form>
    );
}
