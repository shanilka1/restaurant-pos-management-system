import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default function SalesSummary({ summary }) {
    if (!summary) return null;

    return (
        <Row className="mb-4 g-3">
            <Col sm={6} lg={3}>
                <Card className="shadow-sm border-0 h-100 bg-primary text-white">
                    <Card.Body>
                        <p className="mb-1 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Total Sales</p>
                        <h3 className="mb-0 fw-bold">Rs {summary.total_sales?.toFixed(2) || '0.00'}</h3>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={6} lg={3}>
                <Card className="shadow-sm border-0 h-100 bg-success text-white">
                    <Card.Body>
                        <p className="mb-1 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Total Orders</p>
                        <h3 className="mb-0 fw-bold">{summary.total_orders || 0}</h3>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={6} lg={3}>
                <Card className="shadow-sm border-0 h-100 bg-info text-white">
                    <Card.Body>
                        <p className="mb-1 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Items Sold</p>
                        <h3 className="mb-0 fw-bold">{summary.total_items || 0}</h3>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={6} lg={3}>
                <Card className="shadow-sm border-0 h-100 bg-warning text-dark">
                    <Card.Body>
                        <p className="mb-1 fw-bold text-uppercase opacity-75" style={{ fontSize: '0.8rem' }}>Avg Order Value</p>
                        <h3 className="mb-0 fw-bold">Rs {summary.average_order_value?.toFixed(2) || '0.00'}</h3>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
