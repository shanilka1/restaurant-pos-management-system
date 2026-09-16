import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productService, categoryService, orderService, customerService, tableService, heldOrderService, shiftService } from '../services/api';
import useCart from '../hooks/useCart';
import ThermalReceiptModal from '../components/ThermalReceiptModal';
import ShiftModal from '../components/ShiftModal';
import { Row, Col, Card, Button, Form, Badge, Modal, InputGroup, Alert } from 'react-bootstrap';

export default function POS() {
    const location = useLocation();
    
    // Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [heldOrders, setHeldOrders] = useState([]);
    const [currentShift, setCurrentShift] = useState(null);

    // Filters & Selections
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [orderType, setOrderType] = useState('takeaway'); // dine_in, takeaway, delivery
    const [selectedTableId, setSelectedTableId] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, card, qr, split

    // Calculations
    const [discountAmount, setDiscountAmount] = useState(0);
    const [taxPercent, setTaxPercent] = useState(10); // 10% VAT
    const [servicePercent, setServicePercent] = useState(0);
    const [tipAmount, setTipAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState('');

    // Modals & UI
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const [completedOrder, setCompletedOrder] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [showHeldModal, setShowHeldModal] = useState(false);
    const [parkNote, setParkNote] = useState('');

    const { 
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        cartTotalAmount, 
        cartTotalItems 
    } = useCart();

    useEffect(() => {
        // Handle pre-selected table from Floor Map page
        if (location.state?.selectedTable) {
            setOrderType('dine_in');
            setSelectedTableId(location.state.selectedTable.id);
        }

        categoryService.getAll({ per_page: 100 }).then(res => setCategories(res.data.data)).catch(console.error);
        customerService.getAll().then(res => setCustomers(res.data.data || res.data)).catch(console.error);
        tableService.getAll().then(res => setTables(res.data.data || [])).catch(console.error);
        shiftService.getCurrent().then(res => setCurrentShift(res.data.data)).catch(console.error);
        fetchHeldOrders();
    }, [location]);

    useEffect(() => {
        fetchProducts();
    }, [search, categoryId]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await productService.getAll({ search, category_id: categoryId, per_page: 100 });
            setProducts(response.data.data.filter(p => p.is_active));
        } catch (err) {
            console.error('Failed to fetch products');
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchHeldOrders = async () => {
        try {
            const res = await heldOrderService.getAll();
            setHeldOrders(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleParkCart = async () => {
        if (cart.length === 0) return;
        try {
            await heldOrderService.create({
                reference_name: parkNote || `Hold #${Date.now().toString().slice(-4)}`,
                customer_id: selectedCustomerId || null,
                cart_data: cart,
                notes: parkNote,
            });
            clearCart();
            setParkNote('');
            fetchHeldOrders();
            alert('Cart parked successfully!');
        } catch (err) {
            alert('Failed to park cart');
        }
    };

    const handleRestoreHeld = async (held) => {
        clearCart();
        (held.cart_data || []).forEach(item => {
            addToCart(item, item.quantity);
        });
        if (held.customer_id) setSelectedCustomerId(held.customer_id);
        await heldOrderService.delete(held.id);
        fetchHeldOrders();
        setShowHeldModal(false);
    };

    // Math Calculations
    const subtotal = cartTotalAmount;
    const discount = parseFloat(discountAmount) || 0;
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const taxAmount = (taxableSubtotal * (parseFloat(taxPercent) || 0)) / 100;
    const serviceCharge = (taxableSubtotal * (parseFloat(servicePercent) || 0)) / 100;
    const tip = parseFloat(tipAmount) || 0;
    const grandTotal = taxableSubtotal + taxAmount + serviceCharge + tip;
    const tendered = parseFloat(paidAmount) || grandTotal;
    const changeDue = Math.max(0, tendered - grandTotal);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        setCheckoutError(null);

        const payload = {
            items: cart.map(i => ({
                product_id: i.id,
                quantity: i.quantity,
                notes: i.notes || null,
            })),
            customer_id: selectedCustomerId || null,
            order_type: orderType,
            table_id: orderType === 'dine_in' ? selectedTableId : null,
            subtotal,
            discount_amount: discount,
            tax_amount: taxAmount,
            service_charge: serviceCharge,
            tip_amount: tip,
            paid_amount: tendered,
            payment_method: paymentMethod,
        };

        try {
            const res = await orderService.create(payload);
            const createdOrder = res.data.data;
            setCompletedOrder(createdOrder);
            setShowReceiptModal(true);

            clearCart();
            setSelectedCustomerId('');
            setPaidAmount('');
            fetchProducts();
            tableService.getAll().then(r => setTables(r.data.data || [])).catch(console.error);
        } catch (err) {
            setCheckoutError(err.response?.data?.message || err.response?.data?.error || 'Failed to complete checkout');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-3 min-vh-100 bg-light">
            {/* Header / Register Shift Banner */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 bg-white rounded shadow-sm border">
                <div className="d-flex align-items-center gap-3">
                    <h3 className="fw-bold mb-0 text-dark">🛒 POS Billing Terminal</h3>
                    <div className="btn-group">
                        <Button
                            variant={orderType === 'dine_in' ? 'primary' : 'outline-primary'}
                            className="fw-bold px-3"
                            onClick={() => setOrderType('dine_in')}
                        >
                            🍽️ Dine-In
                        </Button>
                        <Button
                            variant={orderType === 'takeaway' ? 'primary' : 'outline-primary'}
                            className="fw-bold px-3"
                            onClick={() => setOrderType('takeaway')}
                        >
                            🛍️ Takeaway
                        </Button>
                        <Button
                            variant={orderType === 'delivery' ? 'primary' : 'outline-primary'}
                            className="fw-bold px-3"
                            onClick={() => setOrderType('delivery')}
                        >
                            🛵 Delivery
                        </Button>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                    <Button variant="outline-warning" className="fw-bold position-relative text-dark" onClick={() => setShowHeldModal(true)}>
                        ⏸️ Parked Carts
                        {heldOrders.length > 0 && (
                            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                                {heldOrders.length}
                            </Badge>
                        )}
                    </Button>
                    <Button
                        variant={currentShift ? 'outline-success' : 'danger'}
                        className="fw-bold"
                        onClick={() => setShowShiftModal(true)}
                    >
                        {currentShift ? `💵 Shift #SH-${currentShift.id} Active` : '⚠️ Open Shift Register'}
                    </Button>
                </div>
            </div>

            <Row className="g-3">
                {/* Left Side: Product Menu */}
                <Col lg={7} xl={8}>
                    <Card className="border-0 shadow-sm mb-3">
                        <Card.Body className="p-3">
                            <Row className="g-2">
                                <Col md={7}>
                                    <Form.Control
                                        type="text"
                                        placeholder="🔍 Search products by SKU or name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="fw-semibold"
                                    />
                                </Col>
                                <Col md={5}>
                                    <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                        <option value="">All Categories ({categories.length})</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row className="g-2">
                        {loadingProducts ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" />
                            </div>
                        ) : (
                            products.map((p) => (
                                <Col key={p.id} xs={6} sm={4} md={3}>
                                    <Card className="h-100 shadow-sm border-0 product-card cursor-pointer hover-shadow" onClick={() => addToCart(p)}>
                                        <Card.Body className="p-2 text-center d-flex flex-column justify-content-between">
                                            <div>
                                                <Badge bg="light" text="dark" className="small border mb-1">{p.category?.name || 'Item'}</Badge>
                                                <h6 className="fw-bold text-dark text-truncate mb-1">{p.name}</h6>
                                                <small className="text-muted font-monospace">{p.sku}</small>
                                            </div>
                                            <div className="mt-2 border-top pt-1 d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-primary fs-6">${parseFloat(p.price).toFixed(2)}</span>
                                                <Badge bg={p.stock_quantity <= 5 ? 'danger' : 'secondary'} className="small">
                                                    Stock: {p.stock_quantity}
                                                </Badge>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Col>

                {/* Right Side: Active Cart & Checkout Panel */}
                <Col lg={5} xl={4}>
                    <Card className="border-0 shadow-sm sticky-top" style={{ top: '15px' }}>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 fw-bold">🛒 Current Cart ({cartTotalItems})</h5>
                            <Button variant="outline-light" size="sm" onClick={clearCart} disabled={cart.length === 0}>
                                Clear Cart
                            </Button>
                        </Card.Header>

                        <Card.Body className="p-3">
                            {checkoutError && <Alert variant="danger" dismissible onClose={() => setCheckoutError(null)}>{checkoutError}</Alert>}

                            {/* Dine In Table Selector */}
                            {orderType === 'dine_in' && (
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small text-primary">Select Table</Form.Label>
                                    <Form.Select value={selectedTableId} onChange={(e) => setSelectedTableId(e.target.value)} required>
                                        <option value="">Choose Table...</option>
                                        {tables.map(t => (
                                            <option key={t.id} value={t.id}>{t.table_number} ({t.section}) - {t.status.toUpperCase()}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}

                            {/* Customer Selector */}
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-secondary">Customer CRM & Loyalty</Form.Label>
                                <Form.Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                                    <option value="">Walk-In Diner / General Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.phone || c.email}) - {c.loyalty_points || 0} Pts</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Cart Itemized List */}
                            <div className="cart-list mb-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                {cart.length === 0 ? (
                                    <div className="text-center py-4 text-muted border rounded bg-light">
                                        <p className="mb-0 small">Cart is empty. Click items from the menu to add.</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                            <div className="pe-2">
                                                <div className="fw-bold text-dark small">{item.name}</div>
                                                <div className="text-muted small">${parseFloat(item.price).toFixed(2)} each</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <Button size="sm" variant="outline-secondary" className="px-2 py-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                                                <span className="fw-bold px-2">{item.quantity}</span>
                                                <Button size="sm" variant="outline-secondary" className="px-2 py-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                                                <Button size="sm" variant="outline-danger" className="ms-1 py-0 px-1" onClick={() => removeFromCart(item.id)}>✕</Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Financial Breakdown Inputs */}
                            <div className="border-top pt-2 small">
                                <Row className="g-2 mb-2">
                                    <Col xs={6}>
                                        <Form.Label className="mb-0 text-muted">Discount ($)</Form.Label>
                                        <Form.Control type="number" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} size="sm" />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Label className="mb-0 text-muted">Tax / VAT (%)</Form.Label>
                                        <Form.Control type="number" step="0.1" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} size="sm" />
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-between mb-1">
                                    <span>Subtotal:</span>
                                    <span className="fw-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="d-flex justify-content-between mb-1 text-danger">
                                        <span>Discount:</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                {taxAmount > 0 && (
                                    <div className="d-flex justify-content-between mb-1 text-muted">
                                        <span>Tax ({taxPercent}%):</span>
                                        <span>+${taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between fs-5 fw-bold text-dark border-top border-dark pt-1 mb-3">
                                    <span>TOTAL:</span>
                                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                                </div>

                                {/* Payment Method & Tendered */}
                                <Form.Group className="mb-2">
                                    <Form.Label className="fw-bold text-dark mb-1">Payment Method</Form.Label>
                                    <div className="d-flex gap-1 mb-2">
                                        {['cash', 'card', 'qr'].map(m => (
                                            <Button
                                                key={m}
                                                size="sm"
                                                variant={paymentMethod === m ? 'dark' : 'outline-dark'}
                                                className="w-100 text-uppercase fw-bold"
                                                onClick={() => setPaymentMethod(m)}
                                            >
                                                {m}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>

                                {paymentMethod === 'cash' && (
                                    <Row className="g-2 mb-3">
                                        <Col xs={6}>
                                            <Form.Label className="mb-0 text-muted">Cash Tendered ($)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                placeholder={grandTotal.toFixed(2)}
                                                value={paidAmount}
                                                onChange={(e) => setPaidAmount(e.target.value)}
                                                size="sm"
                                                className="fw-bold"
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Label className="mb-0 text-muted">Change Due ($)</Form.Label>
                                            <div className="form-control form-control-sm bg-light fw-bold text-success">
                                                ${changeDue.toFixed(2)}
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                        </Card.Body>

                        <Card.Footer className="bg-white p-3 border-0">
                            <div className="d-grid gap-2">
                                <Button
                                    variant="success"
                                    size="lg"
                                    className="fw-bold py-3 shadow"
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0 || isSubmitting}
                                >
                                    {isSubmitting ? 'Processing Order...' : `💳 Complete Checkout ($${grandTotal.toFixed(2)})`}
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleParkCart}
                                    disabled={cart.length === 0}
                                >
                                    ⏸️ Hold / Park Cart
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* Thermal Receipt Modal */}
            <ThermalReceiptModal
                show={showReceiptModal}
                onHide={() => setShowReceiptModal(false)}
                order={completedOrder}
            />

            {/* Shift Modal */}
            <ShiftModal
                show={showShiftModal}
                onHide={() => setShowShiftModal(false)}
                onShiftChange={(shift) => setCurrentShift(shift)}
            />

            {/* Parked Carts Modal */}
            <Modal show={showHeldModal} onHide={() => setShowHeldModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="h5">⏸️ Parked / Held Carts List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {heldOrders.length === 0 ? (
                        <p className="text-center py-4 text-muted">No parked carts.</p>
                    ) : (
                        heldOrders.map(h => (
                            <Card key={h.id} className="mb-2 p-3 shadow-sm border">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">{h.reference_name}</h6>
                                        <div className="small text-muted">{new Date(h.created_at).toLocaleString()} • {h.cart_data?.length || 0} Items</div>
                                    </div>
                                    <Button variant="primary" size="sm" className="fw-bold" onClick={() => handleRestoreHeld(h)}>
                                        ▶️ Restore Cart to Terminal
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}