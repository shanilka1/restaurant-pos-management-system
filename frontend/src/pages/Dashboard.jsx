import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { dashboardService } from '../services/api';

import StatCard from '../components/dashboard/StatCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockProducts from '../components/dashboard/LowStockProducts';
import SalesChart from '../components/dashboard/SalesChart';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getStats();
            setStats(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center h-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!stats) return null;

    return (
        <Container fluid className="py-4">
            <h2 className="mb-4 text-secondary fw-bold">Dashboard Overview</h2>
            
            {/* Top Stats Row */}
            <Row>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Today's Sales" 
                        value={`$${stats.today_sales.toFixed(2)}`} 
                        variant="primary" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Total Sales" 
                        value={`$${stats.total_sales.toFixed(2)}`} 
                        variant="success" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Today's Orders" 
                        value={stats.today_orders} 
                        variant="info" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Total Orders" 
                        value={stats.total_orders} 
                        variant="warning" 
                    />
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Active Products" 
                        value={stats.total_products} 
                        variant="dark" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Total Customers" 
                        value={stats.total_customers} 
                        variant="secondary" 
                    />
                </Col>
            </Row>

            {/* Main Content Row */}
            <Row className="mt-4">
                <Col lg={8}>
                    <SalesChart data={stats.sales_chart} />
                    <RecentOrders orders={stats.recent_orders} />
                </Col>
                <Col lg={4}>
                    <LowStockProducts products={stats.low_stock_products} />
                </Col>
            </Row>
        </Container>
    );
}