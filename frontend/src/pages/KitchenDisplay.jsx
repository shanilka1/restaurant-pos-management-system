import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Form } from 'react-bootstrap';
import { kitchenService } from '../services/api';

const KitchenDisplay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchQueue = async () => {
        try {
            const res = await kitchenService.getQueue();
            setOrders(res.data.data || []);
        } catch (err) {
            console.error('Error fetching kitchen queue:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        let interval;
        if (autoRefresh) {
            interval = setInterval(fetchQueue, 6000); // 6 sec polling
        }
        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await kitchenService.updateOrderStatus(orderId, status);
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateItemStatus = async (itemId, status) => {
        try {
            await kitchenService.updateItemStatus(itemId, status);
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const getItemStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in_kitchen': return 'info';
            case 'ready': return 'success';
            case 'served': return 'dark';
            default: return 'secondary';
        }
    };

    const getElapsedTime = (createdAt) => {
        const mins = Math.floor((new Date() - new Date(createdAt)) / 60000);
        if (mins < 1) return 'Just now';
        return `${mins} mins ago`;
    };

    return (
        <Container fluid className="py-3 bg-dark min-vh-100 text-white">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <div>
                    <h2 className="fw-bold mb-0 text-warning">🍳 KITCHEN DISPLAY SYSTEM (KDS)</h2>
                    <p className="text-secondary small mb-0">Real-time live kitchen tickets queue & preparation status</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <Form.Check
                        type="switch"
                        id="auto-refresh-switch"
                        label="Auto-Refresh Live Queue (6s)"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="fw-bold text-light"
                    />
                    <Button variant="outline-light" size="sm" onClick={fetchQueue}>
                        🔄 Refresh Ticket Queue
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="warning" />
                    <p className="mt-2 text-secondary">Loading live tickets...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-5 bg-secondary bg-opacity-10 rounded border border-secondary">
                    <h4 className="text-secondary">🎉 All Orders Served! Kitchen Clear!</h4>
                    <p className="text-muted small">New orders placed at POS will automatically pop up here.</p>
                </div>
            ) : (
                <Row className="g-3">
                    {orders.map((order) => {
                        const elapsedMins = Math.floor((new Date() - new Date(order.created_at)) / 60000);
                        const isUrgent = elapsedMins >= 15;

                        return (
                            <Col key={order.id} xs={12} sm={6} md={4} lg={3}>
                                <Card className={`h-100 shadow border-2 Rs {isUrgent ? 'border-danger' : 'border-warning'} bg-secondary bg-opacity-25 text-white`}>
                                    <Card.Header className={`d-flex justify-content-between align-items-center py-2 Rs {isUrgent ? 'bg-danger text-white' : 'bg-warning text-dark'}`}>
                                        <div>
                                            <span className="fw-bold fs-5">TICKET #{order.id}</span>
                                            <div className="small fw-semibold">
                                                {order.order_type?.toUpperCase()}
                                                {order.table && ` • Rs {order.table.table_number}`}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Badge bg="dark" className="fs-6">{getElapsedTime(order.created_at)}</Badge>
                                        </div>
                                    </Card.Header>

                                    <Card.Body className="d-flex flex-column justify-content-between p-2">
                                        <div className="mb-3">
                                            {(order.order_items || []).map((item) => (
                                                <div key={item.id} className="p-2 mb-2 bg-dark rounded border border-secondary d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-bold text-light">
                                                            <span className="text-warning fs-5 me-2">{item.quantity}x</span>
                                                            {item.product?.name || 'Item'}
                                                        </div>
                                                        {item.notes && (
                                                            <div className="small text-warning fst-italic mt-1">
                                                                📝 {item.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant={getItemStatusBadge(item.item_status || 'pending')}
                                                        className="py-0 px-2 small text-uppercase font-monospace"
                                                        onClick={() => {
                                                            const nextStatus = item.item_status === 'pending' ? 'in_kitchen' : (item.item_status === 'in_kitchen' ? 'ready' : 'served');
                                                            handleUpdateItemStatus(item.id, nextStatus);
                                                        }}
                                                    >
                                                        {item.item_status || 'pending'}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-top border-secondary pt-2">
                                            <div className="d-grid gap-1">
                                                {order.kitchen_status === 'pending' && (
                                                    <Button variant="info" className="fw-bold" onClick={() => handleUpdateOrderStatus(order.id, 'in_kitchen')}>
                                                        👨‍🍳 Start Cooking
                                                    </Button>
                                                )}
                                                {order.kitchen_status === 'in_kitchen' && (
                                                    <Button variant="success" className="fw-bold" onClick={() => handleUpdateOrderStatus(order.id, 'ready')}>
                                                        🔔 Mark Order Ready
                                                    </Button>
                                                )}
                                                {order.kitchen_status === 'ready' && (
                                                    <Button variant="dark" className="fw-bold text-white border border-light" onClick={() => handleUpdateOrderStatus(order.id, 'served')}>
                                                        ✅ Mark Order Served
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default KitchenDisplay;
