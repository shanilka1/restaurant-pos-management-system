import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { categoryService } from '../../services/api';

export default function DeleteCategoryModal({ show, handleClose, categoryToDelete, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        
        setLoading(true);
        setError(null);

        try {
            await categoryService.delete(categoryToDelete.id);
            onDeleteSuccess();
            handleClose();
        } catch (err) {
            setError('Failed to delete category. It might be linked to existing products.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-danger">Delete Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>?</p>
                <p className="text-muted small">This action cannot be undone. You may not be able to delete it if it is linked to active products.</p>
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
