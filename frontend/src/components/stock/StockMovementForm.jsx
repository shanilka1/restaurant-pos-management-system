import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { stockService, productService } from '../../services/api';

export default function StockMovementForm({ show, handleClose, onSaveSuccess }) {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [formData, setFormData] = useState({
        product_id: '',
        type: 'in',
        quantity: '',
        reason: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch active products on mount
    useEffect(() => {
        if (show) {
            setFormData({
                product_id: '',
                type: 'in',
                quantity: '',
                reason: ''
            });
            setError(null);
            setValidationErrors({});
            fetchProducts();
        }
    }, [show]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await productService.getAll({ per_page: 100 });
            setProducts(res.data.data.filter(p => p.is_active));
        } catch (err) {
            console.error("Failed to load products.");
        } finally {
            setLoadingProducts(false);
        }
    };

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

        // Validate quantity locally first
        const qty = parseFloat(formData.quantity);
        if (isNaN(qty) || qty <= 0) {
            setValidationErrors({ quantity: 'Quantity must be a positive number greater than zero.' });
            setLoading(false);
            return;
        }

        const payload = {
            product_id: parseInt(formData.product_id),
            type: formData.type,
            quantity: qty,
            reason: formData.reason
        };

        try {
            await stockService.create(payload);
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Laravel validation errors use 'errors' object, custom exceptions use 'error' string
                if (err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError('Validation failed. Please correct the highlighted fields.');
                    setValidationErrors(err.response.data.errors || {});
                }
            } else if (err.response && (err.response.status === 400 || err.response.status === 403)) {
                setError(err.response.data.message || 'The stock operation was rejected by the server.');
            } else {
                setError('Failed to record stock movement. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add Stock Movement</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3" controlId="stockProd">
                        <Form.Label>Product <span className="text-danger">*</span></Form.Label>
                        <Form.Select 
                            name="product_id"
                            value={formData.product_id}
                            onChange={handleChange}
                            required
                            isInvalid={!!validationErrors.product_id}
                            disabled={loadingProducts}
                        >
                            <option value="">{loadingProducts ? 'Loading...' : 'Select Product'}</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{validationErrors.product_id}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="row mb-3">
                        <Form.Group as="div" className="col-md-6" controlId="stockType">
                            <Form.Label>Movement Type <span className="text-danger">*</span></Form.Label>
                            <Form.Select 
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                isInvalid={!!validationErrors.type}
                            >
                                <option value="in">IN (Add Stock)</option>
                                <option value="out">OUT (Remove Stock)</option>
                                <option value="adjustment">ADJUSTMENT (Audit/Correct)</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{validationErrors.type}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as="div" className="col-md-6" controlId="stockQty">
                            <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                min="0.01"
                                step="any"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                isInvalid={!!validationErrors.quantity}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.quantity}</Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="stockReason">
                        <Form.Label>Reason</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="reason"
                            placeholder="Optional reason for the movement (e.g. Received new shipment)"
                            value={formData.reason}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.reason}
                        />
                        <Form.Control.Feedback type="invalid">{validationErrors.reason}</Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading || !formData.product_id || !formData.quantity}>
                        {loading ? 'Processing...' : 'Record Movement'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
