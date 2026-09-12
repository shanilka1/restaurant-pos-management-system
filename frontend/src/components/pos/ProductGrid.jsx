import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, onAddToCart }) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center p-5 bg-white border rounded">
                <p className="text-muted mb-0">No products found matching your search.</p>
            </div>
        );
    }

    return (
        <Row className="g-3">
            {products.map(product => (
                <Col key={product.id} xs={12} sm={6} md={4} xl={3}>
                    <ProductCard product={product} onAdd={onAddToCart} />
                </Col>
            ))}
        </Row>
    );
}
