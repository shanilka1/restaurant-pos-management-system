import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';

export default function CategoryForm({ show, handleClose, categoryToEdit, onSaveSuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!categoryToEdit;

    useEffect(() => {
        if (show) {
            if (categoryToEdit) {
                setName(categoryToEdit.name || '');
                setDescription(categoryToEdit.description || '');
            } else {
                setName('');
                setDescription('');
            }
            setError(null);
        }
    }, [show, categoryToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = { name, description };

        try {
            if (isEditMode) {
                await categoryService.update(categoryToEdit.id, payload);
            } else {
                await categoryService.create(payload);
            }
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data.message || 'Validation failed. Check your input.');
            } else {
                setError('Failed to save category. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="catName" className="block text-sm font-bold text-slate-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                            <input
                                id="catName"
                                type="text"
                                placeholder="e.g. Beverages"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="catDesc" className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                            <textarea
                                id="catDesc"
                                rows={3}
                                placeholder="Category description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all resize-none"
                            />
                        </div>
                    </div>
                    <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50">
                        <button type="button" onClick={handleClose} disabled={loading} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || !name.trim()} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
