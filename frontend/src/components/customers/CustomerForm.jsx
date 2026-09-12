import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { customerService } from '../../services/api';

export default function CustomerForm({ show, handleClose, customerToEdit, onSaveSuccess }) {
    const isEditMode = !!customerToEdit;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (show) {
            if (isEditMode) {
                setFormData({
                    name: customerToEdit.name || '',
                    phone: customerToEdit.phone || '',
                    email: customerToEdit.email || '',
                    address: customerToEdit.address || ''
                });
            } else {
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: ''
                });
            }
            setError(null);
            setValidationErrors({});
        }
    }, [show, customerToEdit, isEditMode]);

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

        try {
            if (isEditMode) {
                await customerService.update(customerToEdit.id, formData);
            } else {
                await customerService.create(formData);
            }
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError('Validation failed. Please correct the highlighted fields.');
                setValidationErrors(err.response.data.errors || {});
            } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You do not have permission to perform this action.');
            } else {
                setError('Failed to save customer. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3" controlId="custName">
                        <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            isInvalid={!!validationErrors.name}
                        />
                        <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="custPhone">
                        <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            placeholder="e.g. 123-456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            isInvalid={!!validationErrors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{validationErrors.phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="custEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="e.g. john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.email}
                        />
                        <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="custAddress">
                        <Form.Label>Physical Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            placeholder="e.g. 123 Main St, City, Country"
                            value={formData.address}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.address}
                        />
                        <Form.Control.Feedback type="invalid">{validationErrors.address}</Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading || !formData.name || !formData.phone}>
                        {loading ? 'Saving...' : 'Save Customer'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
