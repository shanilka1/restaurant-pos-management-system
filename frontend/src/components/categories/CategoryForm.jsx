import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { categoryService } from '../../services/api';

export default function CategoryForm({ show, handleClose, categoryToEdit, onSaveSuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!categoryToEdit;

    useEffect(() => {
        if (show) {
            if (categoryToEdit) {
                setName(categoryToEdit.name || '');
                setDescription(categoryToEdit.description || '');
            } else {
                setName('');
                setDescription('');
            }
            setError(null);
        }
    }, [show, categoryToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = { name, description };

        try {
            if (isEditMode) {
                await categoryService.update(categoryToEdit.id, payload);
            } else {
                await categoryService.create(payload);
            }
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data.message || 'Validation failed. Check your input.');
            } else {
                setError('Failed to save category. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Category' : 'Add Category'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3" controlId="catName">
                        <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. Beverages"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="catDesc">
                        <Form.Label>Description (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Category description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading || !name.trim()}>
                        {loading ? 'Saving...' : 'Save Category'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
