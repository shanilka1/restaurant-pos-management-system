import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

export default function LowStockProducts({ products }) {
    if (!products || products.length === 0) {
        return (
            <Card className="mb-4 shadow-sm h-100">
                <Card.Header className="bg-white fw-bold text-success">Stock Alerts</Card.Header>
                <Card.Body>All products have sufficient stock.</Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-4 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold text-danger">Low Stock Alerts</Card.Header>
            <Table responsive hover className="mb-0">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Product</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.sku}</td>
                            <td>{product.name}</td>
                            <td>
                                <Badge bg="danger" pill>{product.stock_quantity}</Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
}
