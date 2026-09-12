import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

export default function OrderTable({ orders, onViewDetails }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center p-4 bg-white border rounded">
                <p className="text-muted mb-0">No orders found.</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed': return <Badge bg="success">Completed</Badge>;
            case 'cancelled': return <Badge bg="danger">Cancelled</Badge>;
            case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Table responsive hover className="bg-white border mb-0">
            <thead className="table-light">
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Cashier</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td className="align-middle fw-bold">#{order.id}</td>
                        <td className="align-middle">{new Date(order.created_at).toLocaleString()}</td>
                        <td className="align-middle">{order.customer?.name || 'Walk-in'}</td>
                        <td className="align-middle">{order.user?.name || '-'}</td>
                        <td className="align-middle fw-bold">${parseFloat(order.total_amount).toFixed(2)}</td>
                        <td className="align-middle">{getStatusBadge(order.status)}</td>
                        <td className="align-middle text-end">
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => onViewDetails(order)}
                            >
                                View Details
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
