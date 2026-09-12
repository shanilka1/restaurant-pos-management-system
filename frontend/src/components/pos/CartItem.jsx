import React from 'react';
import { Button, InputGroup, Form } from 'react-bootstrap';

export default function CartItem({ item, updateQuantity, onRemove }) {
    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) {
            updateQuantity(item.product_id, val);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mb-3 p-2 border-bottom">
            <div className="flex-grow-1">
                <div className="fw-bold">{item.name}</div>
                <div className="text-muted small">${item.price.toFixed(2)} each</div>
            </div>
            
            <div className="d-flex align-items-center" style={{ width: '130px' }}>
                <InputGroup size="sm">
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        -
                    </Button>
                    <Form.Control 
                        className="text-center" 
                        value={item.quantity} 
                        onChange={handleQuantityChange}
                    />
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                        +
                    </Button>
                </InputGroup>
            </div>

            <div className="text-end ms-3" style={{ width: '70px' }}>
                <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                <Button 
                    variant="link" 
                    className="text-danger p-0 text-decoration-none small"
                    onClick={() => onRemove(item.product_id)}
                >
                    Remove
                </Button>
            </div>
        </div>
    );
}
