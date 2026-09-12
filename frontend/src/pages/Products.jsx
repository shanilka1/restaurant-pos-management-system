import React, { useState, useEffect, useContext } from 'react';
import { productService, categoryService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';
import DeleteProductModal from '../components/products/DeleteProductModal';

export default function Products() {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    // Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        // Fetch categories for the filter dropdown
        categoryService.getAll({ per_page: 100 }).then(res => setCategories(res.data.data)).catch(console.error);
    }, []);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search, categoryId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll({ 
                search,
                category_id: categoryId,
                page: currentPage,
                per_page: 10
            });
            setProducts(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch products.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        fetchProducts();
    };

    const handleCategoryFilter = (e) => {
        setCategoryId(e.target.value);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    // Modal Handlers
    const openAddModal = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDelete(true);
    };

    // Action Handlers
    const onActionSuccess = (message) => {
        setSuccessMsg(message);
        fetchProducts();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Products</h2>
                {isAdmin && (
                    <button 
                        onClick={openAddModal}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center"
                    >
                        <span className="mr-2 text-xl leading-none">+</span> Add Product
                    </button>
                )}
            </div>

            {successMsg && (
                <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 font-medium">
                    {successMsg}
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-6 font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by SKU or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all"
                    />
                    <select 
                        value={categoryId} 
                        onChange={handleCategoryFilter}
                        className="w-full sm:max-w-[200px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button 
                        type="submit"
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all"
                    >
                        Search
                    </button>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                    </div>
                ) : (
                    <>
                        <ProductTable 
                            products={products} 
                            onEdit={openEditModal} 
                            onDelete={openDeleteModal} 
                        />
                        
                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-end items-center mt-6 gap-2">
                                <button
                                    disabled={pagination.current_page === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm font-bold text-violet-600 bg-violet-50 rounded-xl">
                                    {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <ProductForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                productToEdit={selectedProduct}
                onSaveSuccess={() => onActionSuccess(selectedProduct ? 'Product updated successfully!' : 'Product created successfully!')}
            />

            <DeleteProductModal
                show={showDelete}
                handleClose={() => setShowDelete(false)}
                productToDelete={selectedProduct}
                onDeleteSuccess={() => onActionSuccess('Product deleted successfully!')}
            />
        </div>
    );
}