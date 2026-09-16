import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Card, Row, Col, Table } from 'react-bootstrap';
import { shiftService } from '../services/api';

const ShiftModal = ({ show, onHide, onShiftChange }) => {
    const [currentShift, setCurrentShift] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openingCash, setOpeningCash] = useState('100.00');
    const [closingCash, setClosingCash] = useState('');
    const [movementType, setMovementType] = useState('in');
    const [movementAmount, setMovementAmount] = useState('');
    const [movementReason, setMovementReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCurrentShift = async () => {
        try {
            setLoading(true);
            const res = await shiftService.getCurrent();
            setCurrentShift(res.data.data);
            if (res.data.data) {
                setClosingCash('');
            }
        } catch (err) {
            console.error('Error fetching shift:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchCurrentShift();
            setError('');
            setSuccess('');
        }
    }, [show]);

    const handleOpenShift = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const res = await shiftService.open({ opening_cash: parseFloat(openingCash) });
            setCurrentShift(res.data.data);
            setSuccess('Shift opened successfully!');
            if (onShiftChange) onShiftChange(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to open shift');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseShift = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const res = await shiftService.close(currentShift.id, { closing_cash: parseFloat(closingCash) });
            setSuccess(`Shift Closed! Z-Report Generated. Variance: $${res.data.data.variance}`);
            setCurrentShift(null);
            if (onShiftChange) onShiftChange(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to close shift');
        } finally {
            setLoading(false);
        }
    };

    const handleCashMovement = async (e) => {
        e.preventDefault();
        if (!movementAmount || !movementReason) return;
        try {
            setLoading(true);
            setError('');
            await shiftService.cashMovement({
                type: movementType,
                amount: parseFloat(movementAmount),
                reason: movementReason
            });
            setSuccess(`Cash ${movementType.toUpperCase()} of $${movementAmount} recorded!`);
            setMovementAmount('');
            setMovementReason('');
            fetchCurrentShift();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record cash movement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="h5 mb-0">💵 Cash Register & Shift Management (Z-Report)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {!currentShift ? (
                    <Card className="p-4 border-0 shadow-sm bg-light">
                        <h5 className="fw-bold text-dark">Start New Cash Shift</h5>
                        <p className="text-muted small">Enter the starting float count in your cash drawer to open the POS shift.</p>
                        <Form onSubmit={handleOpenShift}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Opening Cash Float ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    value={openingCash}
                                    onChange={(e) => setOpeningCash(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="success" className="w-100 fw-bold" disabled={loading}>
                                🚀 Open Shift
                            </Button>
                        </Form>
                    </Card>
                ) : (
                    <div>
                        <Card className="mb-4 bg-light border-0 shadow-sm">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <span className="badge bg-success mb-2">Shift #SH-{currentShift.id} Active</span>
                                        <h6 className="fw-bold mb-1">Opened by: {currentShift.user?.name}</h6>
                                        <p className="text-muted small mb-0">Started at: {new Date(currentShift.opened_at).toLocaleString()}</p>
                                    </Col>
                                    <Col md={6} className="text-md-end mt-3 mt-md-0">
                                        <div className="fs-5 fw-bold text-dark">
                                            Opening Float: <span className="text-success">${parseFloat(currentShift.opening_cash).toFixed(2)}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Row className="mb-4">
                            <Col md={6}>
                                <Card className="p-3 shadow-sm h-100">
                                    <h6 className="fw-bold text-secondary border-bottom pb-2">➕/➖ Cash In / Cash Out Drawer Log</h6>
                                    <Form onSubmit={handleCashMovement}>
                                        <Row className="g-2 mb-2">
                                            <Col md={5}>
                                                <Form.Select value={movementType} onChange={(e) => setMovementType(e.target.value)}>
                                                    <option value="in">Cash In (+)</option>
                                                    <option value="out">Cash Out (-)</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={7}>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Amount ($)"
                                                    value={movementAmount}
                                                    onChange={(e) => setMovementAmount(e.target.value)}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                        <Form.Control
                                            type="text"
                                            placeholder="Reason (e.g. Petty cash for milk)"
                                            className="mb-2"
                                            value={movementReason}
                                            onChange={(e) => setMovementReason(e.target.value)}
                                            required
                                        />
                                        <Button type="submit" variant="outline-primary" className="w-100 btn-sm fw-bold">
                                            Record Drawer Movement
                                        </Button>
                                    </Form>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="p-3 shadow-sm h-100 bg-warning-subtle border-warning">
                                    <h6 className="fw-bold text-dark border-bottom pb-2">🔒 Close Shift & Z-Report</h6>
                                    <Form onSubmit={handleCloseShift}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Count Actual Cash in Drawer ($)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g. 350.00"
                                                value={closingCash}
                                                onChange={(e) => setClosingCash(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" variant="danger" className="w-100 fw-bold mt-2" disabled={loading}>
                                            🔒 Close Shift & Print Z-Report
                                        </Button>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>

                        {currentShift.cash_movements && currentShift.cash_movements.length > 0 && (
                            <div>
                                <h6 className="fw-bold text-secondary">Recent Drawer Movements</h6>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Reason</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentShift.cash_movements.map((m, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <span className={`badge ${m.type === 'in' ? 'bg-success' : 'bg-danger'}`}>
                                                        {m.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>${parseFloat(m.amount).toFixed(2)}</td>
                                                <td>{m.reason}</td>
                                                <td>{new Date(m.created_at).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ShiftModal;
