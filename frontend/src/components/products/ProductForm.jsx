import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { productService, categoryService } from '../../services/api';

export default function ProductForm({ show, handleClose, productToEdit, onSaveSuccess }) {
    const isEditMode = !!productToEdit;

    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category_id: '',
        price: '',
        stock_quantity: '',
        description: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch categories on mount
    useEffect(() => {
        const fetchCats = async () => {
            setLoadingCats(true);
            try {
                // Fetch up to 100 categories for the dropdown, assuming it's enough for a small POS.
                const res = await categoryService.getAll({ per_page: 100 });
                setCategories(res.data.data);
            } catch (err) {
                console.error("Failed to load categories.");
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (show) {
            if (isEditMode) {
                setFormData({
                    name: productToEdit.name || '',
                    sku: productToEdit.sku || '',
                    category_id: productToEdit.category_id || '',
                    price: productToEdit.price || '',
                    stock_quantity: productToEdit.stock_quantity ?? '',
                    description: productToEdit.description || '',
                    is_active: productToEdit.is_active ?? true
                });
            } else {
                setFormData({
                    name: '',
                    sku: '',
                    category_id: '',
                    price: '',
                    stock_quantity: '',
                    description: '',
                    is_active: true
                });
            }
            setError(null);
            setValidationErrors({});
        }
    }, [show, productToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear specific validation error on change
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        // Prepare payload, convert values where necessary
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: formData.stock_quantity === '' ? null : parseFloat(formData.stock_quantity),
            category_id: parseInt(formData.category_id)
        };

        try {
            if (isEditMode) {
                await productService.update(productToEdit.id, payload);
            } else {
                await productService.create(payload);
            }
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError('Validation failed. Please correct the highlighted fields.');
                setValidationErrors(err.response.data.errors || {});
            } else {
                setError('Failed to save product. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Product' : 'Add Product'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <div className="row mb-3">
                        <Form.Group as="div" className="col-md-6" controlId="prodName">
                            <Form.Label>Product Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                isInvalid={!!validationErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as="div" className="col-md-6" controlId="prodSKU">
                            <Form.Label>SKU <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                isInvalid={!!validationErrors.sku}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.sku}</Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="row mb-3">
                        <Form.Group as="div" className="col-md-6" controlId="prodCat">
                            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                            <Form.Select 
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                isInvalid={!!validationErrors.category_id}
                                disabled={loadingCats}
                            >
                                <option value="">{loadingCats ? 'Loading...' : 'Select Category'}</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{validationErrors.category_id}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as="div" className="col-md-3" controlId="prodPrice">
                            <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                isInvalid={!!validationErrors.price}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.price}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as="div" className="col-md-3" controlId="prodStock">
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                isInvalid={!!validationErrors.stock_quantity}
                                disabled={isEditMode}
                            />
                            {isEditMode && (
                                <Form.Text className="text-muted" style={{fontSize: '0.75rem'}}>
                                    Use Stock module to adjust.
                                </Form.Text>
                            )}
                            <Form.Control.Feedback type="invalid">{validationErrors.stock_quantity}</Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="prodDesc">
                        <Form.Label>Description (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.description}
                        />
                        <Form.Control.Feedback type="invalid">{validationErrors.description}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="prodActive">
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label="Product is Active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
