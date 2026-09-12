import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { productService } from '../../services/api';

export default function DeleteProductModal({ show, handleClose, productToDelete, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (!productToDelete) return;
        
        setLoading(true);
        setError(null);

        try {
            await productService.delete(productToDelete.id);
            onDeleteSuccess();
            handleClose();
        } catch (err) {
            setError('Failed to delete product. It might be linked to existing order items.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-danger">Delete Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong> (SKU: {productToDelete?.sku})?</p>
                <p className="text-muted small">This action cannot be undone. You may not be able to delete it if it is linked to past orders.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={loading}>
                    {loading ? 'Deleting...' : 'Yes, Delete'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
