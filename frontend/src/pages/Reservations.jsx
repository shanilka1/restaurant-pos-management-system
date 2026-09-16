import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { reservationService, tableService, customerService } from '../services/api';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [tableId, setTableId] = useState('');
    const [partySize, setPartySize] = useState(2);
    const [resTime, setResTime] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resData, tblData, custData] = await Promise.all([
                reservationService.getAll(),
                tableService.getAll(),
                customerService.getAll(),
            ]);
            setReservations(resData.data.data || []);
            setTables(tblData.data.data || []);
            setCustomers(custData.data.data || custData.data || []);
        } catch (err) {
            console.error('Error loading reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateReservation = async (e) => {
        e.preventDefault();
        try {
            await reservationService.create({
                guest_name: guestName,
                guest_phone: guestPhone,
                customer_id: customerId || null,
                table_id: tableId || null,
                party_size: parseInt(partySize),
                reservation_time: resTime,
                notes: notes,
            });
            setSuccess('Reservation created successfully!');
            setShowModal(false);
            setGuestName('');
            setGuestPhone('');
            setResTime('');
            setNotes('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create reservation');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await reservationService.updateStatus(id, status);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': return 'primary';
            case 'seated': return 'success';
            case 'completed': return 'info';
            case 'cancelled': return 'danger';
            default: return 'warning';
        }
    };

    return (
        <Container fluid className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-0">📅 Restaurant Table Reservations</h3>
                    <p className="text-muted small mb-0">Book tables, manage upcoming dining reservations & seat guests</p>
                </div>
                <Button variant="primary" className="fw-bold" onClick={() => setShowModal(true)}>
                    ➕ New Table Reservation
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Table responsive hover className="align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Guest Name</th>
                                    <th>Contact Phone</th>
                                    <th>Table Assigned</th>
                                    <th>Party Size</th>
                                    <th>Reservation Date & Time</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">No reservations found. Click New Reservation to add one.</td>
                                    </tr>
                                ) : (
                                    reservations.map((r) => (
                                        <tr key={r.id}>
                                            <td className="fw-bold text-dark">{r.guest_name}</td>
                                            <td>{r.guest_phone || 'N/A'}</td>
                                            <td>
                                                {r.table ? (
                                                    <Badge bg="dark">{r.table.table_number} ({r.table.section})</Badge>
                                                ) : (
                                                    <span className="text-muted small">Unassigned</span>
                                                )}
                                            </td>
                                            <td><Badge bg="secondary">{r.party_size} Guests 👥</Badge></td>
                                            <td className="fw-semibold">{new Date(r.reservation_time).toLocaleString()}</td>
                                            <td><Badge bg={getStatusBadge(r.status)} className="text-uppercase">{r.status}</Badge></td>
                                            <td className="text-end">
                                                {r.status === 'confirmed' && (
                                                    <Button size="sm" variant="success" className="me-1" onClick={() => handleStatusUpdate(r.id, 'seated')}>
                                                        🪑 Seat Guest
                                                    </Button>
                                                )}
                                                {r.status !== 'cancelled' && r.status !== 'completed' && (
                                                    <Button size="sm" variant="outline-danger" onClick={() => handleStatusUpdate(r.id, 'cancelled')}>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* New Reservation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="h5">📅 Create New Table Booking</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateReservation}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Guest Name</Form.Label>
                                    <Form.Control type="text" placeholder="e.g. Michael Scott" value={guestName} onChange={e => setGuestName(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Contact Phone Number</Form.Label>
                                    <Form.Control type="text" placeholder="+1 555-0199" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Assign Table</Form.Label>
                                    <Form.Select value={tableId} onChange={e => setTableId(e.target.value)}>
                                        <option value="">Select table...</option>
                                        {tables.map(t => (
                                            <option key={t.id} value={t.id}>{t.table_number} ({t.section}) - Cap: {t.capacity}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Party Size (Number of Guests)</Form.Label>
                                    <Form.Control type="number" min="1" max="20" value={partySize} onChange={e => setPartySize(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Reservation Date & Time</Form.Label>
                                    <Form.Control type="datetime-local" value={resTime} onChange={e => setResTime(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Notes / Special Requests</Form.Label>
                                    <Form.Control as="textarea" rows={2} placeholder="e.g. Birthday celebration, high chair needed" value={notes} onChange={e => setNotes(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Confirm Reservation</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Reservations;
