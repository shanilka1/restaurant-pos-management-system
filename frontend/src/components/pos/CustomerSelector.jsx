import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { customerService } from '../../services/api';

export default function CustomerSelector({ selectedCustomerId, onSelectCustomer }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                // Fetch sufficient customers for the POS dropdown
                const res = await customerService.getAll({ per_page: 200 });
                setCustomers(res.data.data || []);
            } catch (err) {
                console.error('Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-secondary">Customer (Optional)</Form.Label>
            <Form.Select 
                value={selectedCustomerId || ''} 
                onChange={(e) => onSelectCustomer(e.target.value)}
                disabled={loading}
            >
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}
