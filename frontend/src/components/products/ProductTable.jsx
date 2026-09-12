import React, { useContext } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

export default function ProductTable({ products, onEdit, onDelete }) {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    if (!products || products.length === 0) {
        return (
            <div className="text-center p-4 bg-white border rounded">
                <p className="text-muted mb-0">No products found.</p>
            </div>
        );
    }

    return (
        <Table responsive hover className="bg-white border mb-0">
            <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    {isAdmin && <th className="text-end">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {products.map((prod) => (
                    <tr key={prod.id}>
                        <td className="align-middle">{prod.id}</td>
                        <td className="align-middle fw-bold">{prod.name}</td>
                        <td className="align-middle">{prod.sku}</td>
                        <td className="align-middle">{prod.category?.name || '-'}</td>
                        <td className="align-middle">${parseFloat(prod.price).toFixed(2)}</td>
                        <td className="align-middle">
                            {prod.stock_quantity !== null && prod.stock_quantity !== undefined 
                                ? prod.stock_quantity 
                                : '-'}
                        </td>
                        <td className="align-middle">
                            <Badge bg={prod.is_active ? 'success' : 'secondary'}>
                                {prod.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </td>
                        {isAdmin && (
                            <td className="align-middle text-end">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => onEdit(prod)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => onDelete(prod)}
                                >
                                    Delete
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
