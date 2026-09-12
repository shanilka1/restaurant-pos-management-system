import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { orderService } from '../../services/api';

export default function OrderStatusControl({ order, onStatusUpdated }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleUpdate = async () => {
        if (!selectedStatus) return;

        if (selectedStatus === 'cancelled') {
            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this order? This will permanently reverse the transaction and restore stock."
            );
            if (!confirmCancel) return;
        }

        setLoading(true);
        setError(null);

        try {
            await orderService.updateStatus(order.id, { status: selectedStatus });
            onStatusUpdated();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data.message || 'Invalid status transition.');
            } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You do not have permission to change order statuses.');
            } else if (err.response && err.response.status === 500) {
                // Laravel backend transaction failed
                setError(err.response.data.message || 'Server error while processing cancellation.');
            } else {
                setError('Failed to update status.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (order.status === 'cancelled') {
        return (
            <Alert variant="danger" className="mb-0 py-2">
                This order has been cancelled and its stock has been restored.
            </Alert>
        );
    }

    return (
        <div className="bg-light p-3 border rounded d-flex align-items-center justify-content-between">
            <div>
                <strong>Update Status:</strong>
                <div className="text-muted small">Current: {order.status}</div>
            </div>
            
            <div className="d-flex gap-2">
                <Form.Select 
                    size="sm" 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ width: '150px' }}
                >
                    <option value="">Select Status</option>
                    {order.status !== 'pending' && <option value="pending">Pending</option>}
                    {order.status !== 'completed' && <option value="completed">Completed</option>}
                    <option value="cancelled">Cancelled</option>
                </Form.Select>

                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleUpdate} 
                    disabled={loading || !selectedStatus}
                >
                    {loading ? <Spinner size="sm" animation="border" /> : 'Apply'}
                </Button>
            </div>
            
            {error && <div className="text-danger small ms-2">{error}</div>}
        </div>
    );
}
