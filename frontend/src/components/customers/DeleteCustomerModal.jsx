import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { customerService } from '../../services/api';

export default function DeleteCustomerModal({ show, handleClose, customerToDelete, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (!customerToDelete) return;
        
        setLoading(true);
        setError(null);

        try {
            await customerService.delete(customerToDelete.id);
            onDeleteSuccess();
            handleClose();
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You do not have permission to delete customers.');
            } else {
                setError('Failed to delete customer. They might be linked to existing orders.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-danger">Delete Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Are you sure you want to delete the customer <strong>{customerToDelete?.name}</strong>?</p>
                <p className="text-muted small">This action cannot be undone. You may not be able to delete them if they have active orders in the system.</p>
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
