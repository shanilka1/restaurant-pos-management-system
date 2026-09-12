import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { productService } from '../../services/api';

export default function StockFilters({ filters, setFilters, onSearch }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Load active products for the filter dropdown
        productService.getAll({ per_page: 100 })
            .then(res => setProducts(res.data.data))
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
            <Form.Select 
                name="product_id" 
                value={filters.product_id} 
                onChange={handleChange}
                style={{ maxWidth: '250px' }}
            >
                <option value="">All Products</option>
                {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
            </Form.Select>
            
            <Form.Select 
                name="type" 
                value={filters.type} 
                onChange={handleChange}
                style={{ maxWidth: '180px' }}
            >
                <option value="">All Movement Types</option>
                <option value="in">IN</option>
                <option value="out">OUT</option>
                <option value="adjustment">ADJUSTMENT</option>
            </Form.Select>

            <Button variant="outline-secondary" type="submit">Filter</Button>
        </Form>
    );
}
