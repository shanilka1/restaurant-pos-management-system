import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
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
        <Card className="shadow-sm h-100 d-flex flex-column border-0">
            <Card.Header className="bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-secondary">Current Order</h5>
                    {cart.length > 0 && (
                        <Button variant="outline-danger" size="sm" onClick={clearCart} disabled={isSubmitting}>
                            Clear Cart
                        </Button>
                    )}
                </div>
            </Card.Header>
            
            <Card.Body className="d-flex flex-column p-0 flex-grow-1 overflow-hidden">
                <div className="p-3 flex-grow-1 overflow-auto bg-light">
                    {cart.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p>Cart is empty.</p>
                            <small>Select products from the grid to add them to the order.</small>
                        </div>
                    ) : (
                        cart.map(item => (
                            <CartItem 
                                key={item.product_id}
                                item={item}
                                updateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))
                    )}
                </div>

                <div className="p-3 bg-white border-top">
                    <CustomerSelector 
                        selectedCustomerId={selectedCustomerId} 
                        onSelectCustomer={setSelectedCustomerId} 
                    />
                    
                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Total Items:</span>
                        <span className="fw-bold">{cartTotalItems}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <span className="fs-5 fw-bold">Total (Est):</span>
                        <span className="fs-5 fw-bold text-success">${cartTotalAmount.toFixed(2)}</span>
                    </div>

                    <div className="d-grid">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={onPlaceOrder}
                            disabled={cart.length === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Processing Order...' : 'Place Order'}
                        </Button>
                    </div>
                    <div className="text-center mt-2">
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            Final order total is calculated by the server.
                        </small>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
