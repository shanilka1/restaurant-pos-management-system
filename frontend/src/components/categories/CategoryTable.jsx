import React, { useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

export default function CategoryTable({ categories, onEdit, onDelete }) {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center p-4 bg-white border rounded">
                <p className="text-muted mb-0">No categories found.</p>
            </div>
        );
    }

    return (
        <Table responsive hover className="bg-white border mb-0">
            <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created At</th>
                    {isAdmin && <th className="text-end">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id}>
                        <td className="align-middle">{cat.id}</td>
                        <td className="align-middle fw-bold">{cat.name}</td>
                        <td className="align-middle">{cat.description || '-'}</td>
                        <td className="align-middle">{new Date(cat.created_at).toLocaleDateString()}</td>
                        {isAdmin && (
                            <td className="align-middle text-end">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => onEdit(cat)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => onDelete(cat)}
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
