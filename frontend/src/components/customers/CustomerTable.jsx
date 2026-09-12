import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function CustomerTable({ customers, onEdit, onDelete }) {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    if (!customers || customers.length === 0) {
        return (
            <div className="text-center p-6 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-slate-500 font-medium mb-0">No customers found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">ID</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Name</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Phone</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Email</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Address</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Created At</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50/50">
                            <td className="py-4 text-sm font-semibold text-slate-700">{customer.id}</td>
                            <td className="py-4 text-sm font-bold text-slate-900">{customer.name}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700">{customer.phone}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700">{customer.email || '-'}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700">{customer.address || '-'}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700">{new Date(customer.created_at).toLocaleDateString()}</td>
                            <td className="py-4 text-sm font-semibold text-right space-x-2">
                                <button 
                                    className="bg-white border border-slate-200 text-violet-600 hover:bg-violet-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                    onClick={() => onEdit(customer)}
                                >
                                    Edit
                                </button>
                                {isAdmin && (
                                    <button 
                                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                        onClick={() => onDelete(customer)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
