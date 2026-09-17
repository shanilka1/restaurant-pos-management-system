import React from 'react';
import { Card, Table } from 'react-bootstrap';

export default function ProductReportTable({ products }) {
    if (!products || products.length === 0) {
        return (
            <Card className="shadow-sm border-0">
                <Card.Body className="text-center py-4">
                    <p className="text-muted mb-0">No product sales data available for this date range.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3 border-bottom">
                <h5 className="mb-0 text-secondary fw-bold">Top Selling Products</h5>
            </Card.Header>
            <Table responsive hover className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Product Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th className="text-center">Quantity Sold</th>
                        <th className="text-end">Sales Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, index) => (
                        <tr key={p.id}>
                            <td className="align-middle fw-bold">
                                {index < 3 && <span className="me-2" title={`Rank ${index + 1}`}>🏆</span>}
                                {p.product_name}
                            </td>
                            <td className="align-middle">{p.sku}</td>
                            <td className="align-middle">{p.category_name || '-'}</td>
                            <td className="align-middle text-center">{p.quantity_sold}</td>
                            <td className="align-middle text-end fw-bold text-success">Rs {parseFloat(p.sales_amount).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
}
