import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function CategoryTable({ categories, onEdit, onDelete }) {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center p-6 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-slate-500 font-medium mb-0">No categories found.</p>
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
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Description</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Created At</th>
                        {isAdmin && <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50/50">
                            <td className="py-4 text-sm font-semibold text-slate-700">{cat.id}</td>
                            <td className="py-4 text-sm font-bold text-slate-900">{cat.name}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700">{cat.description || '-'}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700">{new Date(cat.created_at).toLocaleDateString()}</td>
                            {isAdmin && (
                                <td className="py-4 text-sm font-semibold text-right space-x-2">
                                    <button 
                                        className="bg-white border border-slate-200 text-violet-600 hover:bg-violet-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                        onClick={() => onEdit(cat)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                        onClick={() => onDelete(cat)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
