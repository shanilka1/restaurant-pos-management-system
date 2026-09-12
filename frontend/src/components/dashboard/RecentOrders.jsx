import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

export default function RecentOrders({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-white fw-bold">Recent Orders</Card.Header>
                <Card.Body>No recent orders found.</Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white fw-bold">Recent Orders</Card.Header>
            <Table responsive hover className="mb-0">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Cashier</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{new Date(order.created_at).toLocaleString()}</td>
                            <td>{order.customer ? order.customer.name : 'Walk-in'}</td>
                            <td>{order.user ? order.user.name : '-'}</td>
                            <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td>
                                <Badge 
                                    bg={
                                        order.status === 'completed' ? 'success' : 
                                        order.status === 'cancelled' ? 'danger' : 'warning'
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
}
