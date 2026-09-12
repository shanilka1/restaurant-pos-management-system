import React, { useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

export default function CustomerTable({ customers, onEdit, onDelete }) {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    if (!customers || customers.length === 0) {
        return (
            <div className="text-center p-4 bg-white border rounded">
                <p className="text-muted mb-0">No customers found.</p>
            </div>
        );
    }

    return (
        <Table responsive hover className="bg-white border mb-0">
            <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Created At</th>
                    <th className="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td className="align-middle">{customer.id}</td>
                        <td className="align-middle fw-bold">{customer.name}</td>
                        <td className="align-middle">{customer.phone}</td>
                        <td className="align-middle">{customer.email || '-'}</td>
                        <td className="align-middle">{customer.address || '-'}</td>
                        <td className="align-middle">{new Date(customer.created_at).toLocaleDateString()}</td>
                        <td className="align-middle text-end">
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => onEdit(customer)}
                            >
                                Edit
                            </Button>
                            {isAdmin && (
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => onDelete(customer)}
                                >
                                    Delete
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
