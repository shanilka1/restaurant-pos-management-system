import React from 'react';
import { Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card className="mb-4 shadow-sm h-100">
                <Card.Header className="bg-white fw-bold">Sales (Last 7 Days)</Card.Header>
                <Card.Body className="d-flex align-items-center justify-content-center">
                    <p className="text-muted">No sales data available.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-4 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">Sales (Last 7 Days)</Card.Header>
            <Card.Body style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="total" stroke="#0d6efd" strokeWidth={3} activeDot={{ r: 8 }} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card.Body>
        </Card>
    );
}
