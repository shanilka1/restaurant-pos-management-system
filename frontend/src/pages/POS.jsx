import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
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
        <Container fluid className="h-100 py-3 d-flex flex-column" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-shrink-0">
                <h2 className="text-secondary fw-bold mb-0">POS Terminal</h2>
                {successMsg && <Alert variant="success" className="mb-0 py-2">{successMsg}</Alert>}
            </div>

            <Row className="flex-grow-1 overflow-hidden">
                {/* Left Side: Product Grid */}
                <Col lg={8} className="h-100 d-flex flex-column pe-lg-3 mb-4 mb-lg-0">
                    <Card className="shadow-sm border-0 mb-3 flex-shrink-0">
                        <Card.Body className="py-2">
                            <Form onSubmit={handleSearch} className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Search by SKU or name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-grow-1"
                                />
                                <Form.Select 
                                    value={categoryId} 
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Form.Select>
                            </Form>
                        </Card.Body>
                    </Card>

                    <div className="flex-grow-1 overflow-auto pe-2" style={{ minHeight: '300px' }}>
                        <ProductGrid 
                            products={products} 
                            loading={loadingProducts} 
                            onAddToCart={addToCart} 
                        />
                    </div>
                </Col>

                {/* Right Side: Cart */}
                <Col lg={4} className="h-100 pb-3">
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
                </Col>
            </Row>
        </Container>
    );
}