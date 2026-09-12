import React from 'react';
import CartItem from './CartItem';
import CustomerSelector from './CustomerSelector';

export default function Cart({ 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotalAmount, 
    cartTotalItems,
    selectedCustomerId,
    setSelectedCustomerId,
    onPlaceOrder,
    isSubmitting,
    error 
}) {
    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col overflow-hidden">
            <div className="bg-white p-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                    <h5 className="mb-0 text-lg font-bold text-slate-800">Current Order</h5>
                    {cart.length > 0 && (
                        <button 
                            className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold py-1.5 px-3 rounded-xl shadow-sm transition-all text-sm disabled:opacity-50"
                            onClick={clearCart} 
                            disabled={isSubmitting}
                        >
                            Clear Cart
                        </button>
                    )}
                </div>
            </div>
            
            <div className="flex flex-col p-0 flex-grow overflow-hidden bg-slate-50/50">
                <div className="p-4 flex-grow overflow-auto">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-500 my-10">
                            <p className="font-medium">Cart is empty.</p>
                            <small className="text-slate-400">Select products from the grid to add them to the order.</small>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <CartItem 
                                    key={item.product_id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="mb-4">
                        <CustomerSelector 
                            selectedCustomerId={selectedCustomerId} 
                            onSelectCustomer={setSelectedCustomerId} 
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 text-red-800 p-3 rounded-xl mb-4 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500 font-medium">Total Items:</span>
                        <span className="font-bold text-slate-700">{cartTotalItems}</span>
                    </div>
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-lg font-bold text-slate-800">Total (Est):</span>
                        <span className="text-xl font-bold text-emerald-600">${cartTotalAmount.toFixed(2)}</span>
                    </div>

                    <div className="w-full">
                        <button 
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-md transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onPlaceOrder}
                            disabled={cart.length === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Processing Order...' : 'Place Order'}
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <small className="text-slate-400 text-xs font-medium">
                            Final order total is calculated by the server.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
