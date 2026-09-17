import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Tab, Nav, Spinner, Alert } from 'react-bootstrap';
import { tableService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TableManagement = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSwitchModal, setShowSwitchModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [fromTableId, setFromTableId] = useState('');
    const [toTableId, setToTableId] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [section, setSection] = useState('main');
    const [capacity, setCapacity] = useState(4);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchTables = async () => {
        try {
            setLoading(true);
            const res = await tableService.getAll();
            setTables(res.data.data || []);
        } catch (err) {
            console.error('Error fetching tables:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleCreateTable = async (e) => {
        e.preventDefault();
        try {
            await tableService.create({ table_number: tableNumber, section, capacity });
            setSuccess('Table created successfully');
            setShowAddModal(false);
            setTableNumber('');
            fetchTables();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create table');
        }
    };

    const handleSwitchTable = async (e) => {
        e.preventDefault();
        try {
            await tableService.switchTable({ from_table_id: fromTableId, to_table_id: toTableId });
            setSuccess('Table switched successfully');
            setShowSwitchModal(false);
            fetchTables();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to switch table');
        }
    };

    const handleStatusUpdate = async (tableId, newStatus) => {
        try {
            await tableService.update(tableId, { status: newStatus });
            fetchTables();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTables = activeSection === 'all'
        ? tables
        : tables.filter(t => t.section === activeSection);

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'occupied': return 'danger';
            case 'reserved': return 'warning';
            case 'cleaning': return 'secondary';
            default: return 'info';
        }
    };

    return (
        <Container fluid className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-0">🍽️ Restaurant Table Floor Map</h3>
                    <p className="text-muted small mb-0">Manage dining sections, view occupied tables, switch tables & assign orders</p>
                </div>
                <div>
                    <Button variant="outline-dark" className="me-2 fw-bold" onClick={() => setShowSwitchModal(true)}>
                        🔄 Switch / Move Table
                    </Button>
                    <Button variant="primary" className="fw-bold" onClick={() => setShowAddModal(true)}>
                        ➕ Add New Table
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Section Filter Tabs */}
            <Tab.Container activeKey={activeSection} onSelect={(k) => setActiveSection(k)}>
                <Nav variant="pills" className="mb-4 bg-white p-2 rounded shadow-sm border">
                    <Nav.Item><Nav.Link eventKey="all" className="fw-bold">All Sections ({tables.length})</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="main" className="fw-bold">Main Dining Room</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="outdoor" className="fw-bold">Outdoor Terrace</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="vip" className="fw-bold">VIP Section</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="bar" className="fw-bold">Bar Area</Nav.Link></Nav.Item>
                </Nav>
            </Tab.Container>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading floor plan layout...</p>
                </div>
            ) : (
                <Row className="g-3">
                    {filteredTables.map((t) => (
                        <Col key={t.id} xs={12} sm={6} md={4} lg={3}>
                            <Card className={`h-100 shadow-sm border-2 border-Rs ${getStatusColor(t.status)}`}>
                                <Card.Header className={`bg-Rs ${getStatusColor(t.status)} text-white d-flex justify-content-between align-items-center py-2`}>
                                    <span className="fw-bold fs-5">{t.table_number}</span>
                                    <Badge bg="light" text="dark" className="text-uppercase small">{t.section}</Badge>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-between bg-light">
                                    <div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted small">Capacity:</span>
                                            <span className="fw-bold">{t.capacity} Guests 👥</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted small">Status:</span>
                                            <Badge bg={getStatusColor(t.status)} className="text-uppercase">{t.status}</Badge>
                                        </div>
                                        {t.current_order && (
                                            <div className="bg-white p-2 rounded border mt-2 small">
                                                <div className="fw-bold text-primary">Active Bill #{t.current_order.id}</div>
                                                <div className="text-dark font-monospace">Rs {parseFloat(t.current_order.total_amount).toFixed(2)}</div>
                                                <div className="text-muted small">{t.current_order.order_items?.length || 0} Items</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 border-top pt-2">
                                        {t.status === 'occupied' ? (
                                            <div className="d-grid gap-1">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    className="fw-bold"
                                                    onClick={() => navigate('/pos', { state: { selectedTable: t } })}
                                                >
                                                    🛒 View Bill / Checkout POS
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(t.id, 'cleaning')}
                                                >
                                                    🧹 Mark Cleaning
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="d-grid gap-1">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="fw-bold"
                                                    onClick={() => navigate('/pos', { state: { selectedTable: t } })}
                                                >
                                                    🪑 Seat Guests & Take Order
                                                </Button>
                                                {t.status === 'cleaning' && (
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(t.id, 'available')}
                                                    >
                                                        ✅ Ready / Available
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Add Table Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="h5">➕ Add New Restaurant Table</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateTable}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Table Number / Identifier</Form.Label>
                            <Form.Control type="text" placeholder="e.g. T-04 or OUT-03" value={tableNumber} onChange={e => setTableNumber(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Dining Section</Form.Label>
                            <Form.Select value={section} onChange={e => setSection(e.target.value)}>
                                <option value="main">Main Dining Room</option>
                                <option value="outdoor">Outdoor Terrace</option>
                                <option value="vip">VIP Room</option>
                                <option value="bar">Bar Counter</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Seating Capacity</Form.Label>
                            <Form.Control type="number" min="1" max="20" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Table</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Switch Table Modal */}
            <Modal show={showSwitchModal} onHide={() => setShowSwitchModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="h5">🔄 Move / Switch Guests Table</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSwitchTable}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">From (Occupied Table)</Form.Label>
                            <Form.Select value={fromTableId} onChange={e => setFromTableId(e.target.value)} required>
                                <option value="">Select occupied table...</option>
                                {tables.filter(t => t.status === 'occupied').map(t => (
                                    <option key={t.id} value={t.id}>{t.table_number} ({t.section}) - Bill #${t.current_order_id}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">To (Destination Table)</Form.Label>
                            <Form.Select value={toTableId} onChange={e => setToTableId(e.target.value)} required>
                                <option value="">Select empty table...</option>
                                {tables.filter(t => t.status === 'available').map(t => (
                                    <option key={t.id} value={t.id}>{t.table_number} ({t.section}) - Cap: {t.capacity}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSwitchModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Execute Table Switch</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default TableManagement;
