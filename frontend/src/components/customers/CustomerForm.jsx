import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

export default function CustomerForm({ show, handleClose, customerToEdit, onSaveSuccess }) {
    const isEditMode = !!customerToEdit;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (show) {
            if (isEditMode) {
                setFormData({
                    name: customerToEdit.name || '',
                    phone: customerToEdit.phone || '',
                    email: customerToEdit.email || '',
                    address: customerToEdit.address || ''
                });
            } else {
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: ''
                });
            }
            setError(null);
            setValidationErrors({});
        }
    }, [show, customerToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            if (isEditMode) {
                await customerService.update(customerToEdit.id, formData);
            } else {
                await customerService.create(formData);
            }
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError('Validation failed. Please correct the highlighted fields.');
                setValidationErrors(err.response.data.errors || {});
            } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You do not have permission to perform this action.');
            } else {
                setError('Failed to save customer. Please try again later.');
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
                    <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Customer' : 'Add Customer'}</h2>
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
                            <label htmlFor="custName" className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                            <input
                                id="custName"
                                type="text"
                                name="name"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 rounded-xl border Rs {validationErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                            />
                            {validationErrors.name && <p className="text-red-500 text-xs mt-1 font-medium">{validationErrors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="custPhone" className="block text-sm font-bold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                id="custPhone"
                                type="text"
                                name="phone"
                                placeholder="e.g. 123-456-7890"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 rounded-xl border Rs {validationErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                            />
                            {validationErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{validationErrors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="custEmail" className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                            <input
                                id="custEmail"
                                type="email"
                                name="email"
                                placeholder="e.g. john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border Rs {validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                            />
                            {validationErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{validationErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="custAddress" className="block text-sm font-bold text-slate-700 mb-1">Physical Address</label>
                            <textarea
                                id="custAddress"
                                rows={2}
                                name="address"
                                placeholder="e.g. 123 Main St, City, Country"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border Rs {validationErrors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all resize-none`}
                            />
                            {validationErrors.address && <p className="text-red-500 text-xs mt-1 font-medium">{validationErrors.address}</p>}
                        </div>

                    </div>
                    <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50">
                        <button type="button" onClick={handleClose} disabled={loading} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || !formData.name || !formData.phone} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Save Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
