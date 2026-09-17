import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

export default function ProductCard({ product, onAdd }) {
    const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0;

    return (
        <Card className="shadow-sm h-100 border-0" style={{ cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}>
            <Card.Body className="d-flex flex-column" onClick={() => !isOutOfStock && onAdd(product)}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 fw-bold fs-6">{product.name}</Card.Title>
                    <Badge bg="primary">Rs {parseFloat(product.price).toFixed(2)}</Badge>
                </div>
                
                <Card.Text className="text-muted small mb-3 flex-grow-1">
                    SKU: {product.sku} <br/>
                    {product.category?.name && `Cat: ${product.category.name}`}
                </Card.Text>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <small className={isOutOfStock ? 'text-danger fw-bold' : 'text-success'}>
                        {product.stock_quantity !== null ? `Stock: ${product.stock_quantity}` : 'In Stock'}
                    </small>
                    <Button 
                        variant={isOutOfStock ? 'secondary' : 'outline-primary'} 
                        size="sm"
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add'}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
