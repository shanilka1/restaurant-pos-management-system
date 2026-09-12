import React from 'react';
import { Table, Badge } from 'react-bootstrap';

export default function StockMovementTable({ movements }) {
    if (!movements || movements.length === 0) {
        return (
            <div className="text-center p-4 bg-white border rounded">
                <p className="text-muted mb-0">No stock movements found.</p>
            </div>
        );
    }

    const getTypeBadge = (type) => {
        switch(type) {
            case 'in': return <Badge bg="success">IN</Badge>;
            case 'out': return <Badge bg="danger">OUT</Badge>;
            case 'adjustment': return <Badge bg="warning" text="dark">ADJUSTMENT</Badge>;
            default: return <Badge bg="secondary">{type}</Badge>;
        }
    };

    return (
        <Table responsive hover className="bg-white border mb-0">
            <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Prev Stock</th>
                    <th>New Stock</th>
                    <th>Reason</th>
                    <th>User</th>
                </tr>
            </thead>
            <tbody>
                {movements.map((mov) => (
                    <tr key={mov.id}>
                        <td className="align-middle">{mov.id}</td>
                        <td className="align-middle">{new Date(mov.created_at).toLocaleString()}</td>
                        <td className="align-middle fw-bold">{mov.product?.name || '-'} <br/><small className="text-muted">{mov.product?.sku}</small></td>
                        <td className="align-middle">{getTypeBadge(mov.type)}</td>
                        <td className="align-middle fw-bold">
                            {mov.type === 'out' ? '-' : (mov.type === 'in' ? '+' : '')}{mov.quantity}
                        </td>
                        <td className="align-middle">{mov.previous_stock}</td>
                        <td className="align-middle">{mov.new_stock}</td>
                        <td className="align-middle">{mov.reason || '-'}</td>
                        <td className="align-middle">{mov.user?.name || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
