import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { customerService } from '../../services/api';

export default function OrderFilters({ filters, setFilters, onSearch }) {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        customerService.getAll({ per_page: 200 })
            .then(res => setCustomers(res.data.data))
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <Form onSubmit={handleSubmit} className="d-flex flex-wrap gap-2 mb-3">
            <Form.Control
                type="text"
                name="search"
                placeholder="Search Order ID..."
                value={filters.search || ''}
                onChange={handleChange}
                style={{ maxWidth: '150px' }}
            />

            <Form.Select 
                name="customer_id" 
                value={filters.customer_id || ''} 
                onChange={handleChange}
                style={{ maxWidth: '200px' }}
            >
                <option value="">All Customers</option>
                {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </Form.Select>
            
            <Form.Select 
                name="status" 
                value={filters.status || ''} 
                onChange={handleChange}
                style={{ maxWidth: '180px' }}
            >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </Form.Select>

            <Form.Control
                type="date"
                name="date"
                value={filters.date || ''}
                onChange={handleChange}
                style={{ maxWidth: '160px' }}
            />

            <Button variant="outline-secondary" type="submit">Filter</Button>
        </Form>
    );
}
