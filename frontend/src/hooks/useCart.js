import { useState } from 'react';

export default function useCart() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product_id === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.product_id === product.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { 
                id: product.id,
                product_id: product.id, 
                name: product.name, 
                price: parseFloat(product.price),
                sku: product.sku,
                stock_quantity: product.stock_quantity,
                quantity: 1 
            }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) return; // Prevent 0 or negative
        setCart(prevCart => prevCart.map(item => 
            item.product_id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Calculate temporary UX totals
    const cartTotalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Generate strict backend payload
    const getOrderPayload = (customerId = null) => {
        return {
            customer_id: customerId || null,
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        };
    };

    return {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotalAmount,
        cartTotalItems,
        getOrderPayload
    };
}
