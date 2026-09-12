import React from 'react';
import { Card } from 'react-bootstrap';

export default function StatCard({ title, value, variant = 'primary' }) {
    return (
        <Card className={`text-white bg-${variant} mb-3 shadow-sm`}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text className="fs-3 fw-bold">
                    {value}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
