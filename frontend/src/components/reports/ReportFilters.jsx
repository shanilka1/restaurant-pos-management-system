import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function ReportFilters({ startDate, endDate, setStartDate, setEndDate, onFilter, loading }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter();
    };

    return (
        <Form onSubmit={handleSubmit} className="d-flex flex-wrap gap-3 align-items-end mb-4 bg-white p-3 border rounded shadow-sm">
            <Form.Group controlId="startDate">
                <Form.Label className="text-muted small fw-bold">Start Date</Form.Label>
                <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate} // Cannot be after end date
                    required
                />
            </Form.Group>
            
            <Form.Group controlId="endDate">
                <Form.Label className="text-muted small fw-bold">End Date</Form.Label>
                <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate} // Cannot be before start date
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Generate Report'}
            </Button>
        </Form>
    );
}
