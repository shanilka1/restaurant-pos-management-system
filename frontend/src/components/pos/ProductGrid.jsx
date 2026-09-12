import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, onAddToCart }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center p-10 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-slate-500 font-medium mb-0">No products found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
                <div key={product.id}>
                    <ProductCard product={product} onAdd={onAddToCart} />
                </div>
            ))}
        </div>
    );
}
