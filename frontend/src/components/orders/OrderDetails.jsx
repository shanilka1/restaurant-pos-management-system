import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Spinner, Badge } from 'react-bootstrap';
import { orderService } from '../../services/api';
import OrderStatusControl from './OrderStatusControl';

export default function OrderDetails({ show, handleClose, orderId, onUpdateSuccess }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && orderId) {
            fetchOrderDetails();
        }
    }, [show, orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await orderService.getById(orderId);
            setOrder(res.data.data);
        } catch (err) {
            setError('Failed to load order details.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = () => {
        // Refresh details after a status change (e.g. cancelled)
        fetchOrderDetails();
        onUpdateSuccess();
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed': return <Badge bg="success">Completed</Badge>;
            case 'cancelled': return <Badge bg="danger">Cancelled</Badge>;
            case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Order Details #{orderId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <div className="text-danger">{error}</div>
                ) : order ? (
                    <div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}<br/>
                                <strong>Status:</strong> {getStatusBadge(order.status)}
                            </div>
                            <div className="col-md-6 text-md-end mt-3 mt-md-0">
                                <strong>Customer:</strong> {order.customer?.name || 'Walk-in'}<br/>
                                <strong>Cashier:</strong> {order.user?.name || '-'}
                            </div>
                        </div>

                        <OrderStatusControl 
                            order={order} 
                            onStatusUpdated={handleStatusUpdate} 
                        />

                        <h6 className="mt-4 fw-bold border-bottom pb-2">Order Items</h6>
                        <Table size="sm" responsive hover className="mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-end">Unit Price</th>
                                    <th className="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems?.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.product?.name || `Product #${item.product_id}`}
                                            <br/>
                                            <small className="text-muted">{item.product?.sku}</small>
                                        </td>
                                        <td className="text-center align-middle">{item.quantity}</td>
                                        <td className="text-end align-middle">${parseFloat(item.unit_price).toFixed(2)}</td>
                                        <td className="text-end align-middle fw-bold">${parseFloat(item.subtotal).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="text-end fw-bold">Total:</td>
                                    <td className="text-end fw-bold fs-5">${parseFloat(order.total_amount).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
