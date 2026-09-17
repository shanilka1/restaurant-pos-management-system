import React from 'react';
import { Card } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function SalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body className="text-center py-5">
                    <p className="text-muted mb-0">No sales data available for this date range.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
                <h5 className="mb-4 text-secondary fw-bold">Daily Sales Revenue</h5>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip 
                                formatter={(value) => [`Rs ${parseFloat(value).toFixed(2)}`, 'Sales']}
                                labelStyle={{ color: '#333', fontWeight: 'bold' }}
                            />
                            <Legend />
                            <Bar dataKey="sales" name="Revenue" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card.Body>
        </Card>
    );
}
