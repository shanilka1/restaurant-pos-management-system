import React, { useState, useEffect } from 'react';
import { productService, categoryService, orderService } from '../services/api';
import useCart from '../hooks/useCart';

import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';

export default function POS() {
    // Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Filter State
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    
    // UI State
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Cart Hook
    const { 
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        cartTotalAmount, 
        cartTotalItems,
        getOrderPayload
    } = useCart();

    const [selectedCustomerId, setSelectedCustomerId] = useState('');

    useEffect(() => {
        // Fetch categories for filter dropdown
        categoryService.getAll({ per_page: 100 })
            .then(res => setCategories(res.data.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, categoryId]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            // In a real POS, we fetch a large batch of products or use infinite scroll.
            // For this mini POS, we fetch up to 100 at a time for quick grid rendering.
            const response = await productService.getAll({ 
                search,
                category_id: categoryId,
                per_page: 100 
            });
            // Filter out inactive products so cashier doesn't see them
            setProducts(response.data.data.filter(p => p.is_active));
        } catch (err) {
            console.error('Failed to fetch products for POS');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        
        setIsSubmitting(true);
        setCheckoutError(null);
        setSuccessMsg(null);

        const payload = getOrderPayload(selectedCustomerId);

        try {
            const response = await orderService.create(payload);
            const orderId = response.data.data.id;
            
            setSuccessMsg(`Order #${orderId} placed successfully!`);
            clearCart();
            setSelectedCustomerId('');
            
            // Refresh products so the updated stock (decremented by Laravel) reflects immediately in the grid
            fetchProducts();
            
            // Auto hide success message after 5 seconds
            setTimeout(() => setSuccessMsg(null), 5000);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // E.g. insufficient stock checked by backend validation or transaction exception
                if (err.response.data.error) {
                    setCheckoutError(err.response.data.error);
                } else {
                    setCheckoutError(err.response.data.message || 'Validation failed. Check your cart quantities.');
                }
            } else if (err.response && (err.response.status === 400 || err.response.status === 403)) {
                setCheckoutError(err.response.data.message || 'The server rejected this order.');
            } else {
                setCheckoutError('Failed to place order due to a network or server error.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen py-3 px-4 overflow-hidden bg-slate-50">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <h2 className="text-2xl font-bold text-slate-700">POS Terminal</h2>
                {successMsg && (
                    <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-medium m-0">
                        {successMsg}
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row flex-grow overflow-hidden gap-4">
                {/* Left Side: Product Grid */}
                <div className="lg:w-2/3 xl:w-3/4 h-full flex flex-col mb-4 lg:mb-0">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 mb-4 shrink-0">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by SKU or name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all"
                            />
                            <select 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-[200px] px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </form>
                    </div>

                    <div className="flex-grow overflow-auto pr-2 min-h-[300px]">
                        <ProductGrid 
                            products={products} 
                            loading={loadingProducts} 
                            onAddToCart={addToCart} 
                        />
                    </div>
                </div>

                {/* Right Side: Cart */}
                <div className="lg:w-1/3 xl:w-1/4 h-full pb-3">
                    <Cart 
                        cart={cart}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart}
                        cartTotalAmount={cartTotalAmount}
                        cartTotalItems={cartTotalItems}
                        selectedCustomerId={selectedCustomerId}
                        setSelectedCustomerId={setSelectedCustomerId}
                        onPlaceOrder={handlePlaceOrder}
                        isSubmitting={isSubmitting}
                        error={checkoutError}
                    />
                </div>
            </div>
        </div>
    );
}