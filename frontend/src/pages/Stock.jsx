import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import { stockService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

import StockMovementTable from '../components/stock/StockMovementTable';
import StockMovementForm from '../components/stock/StockMovementForm';
import StockFilters from '../components/stock/StockFilters';

export default function Stock() {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    // Data State
    const [movements, setMovements] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [filters, setFilters] = useState({ product_id: '', type: '' });
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchMovements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchMovements = async () => {
        try {
            setLoading(true);
            const response = await stockService.getAll({ 
                ...filters,
                page: currentPage,
                per_page: 10
            });
            setMovements(response.data.data || response.data); // Laravel paginator sometimes wraps in extra .data
            
            const p = response.data;
            setPagination({
                current_page: p.current_page || 1,
                last_page: p.last_page || 1
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch stock movements.');
            setMovements([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (currentPage === 1) {
            fetchMovements();
        } else {
            setCurrentPage(1); // Effect triggers fetch
        }
    };

    const onActionSuccess = () => {
        setSuccessMsg('Stock movement recorded successfully!');
        if (currentPage === 1) {
            fetchMovements();
        } else {
            setCurrentPage(1);
        }
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-bold mb-0">Stock Management</h2>
                {isAdmin && (
                    <Button variant="primary" onClick={() => setShowForm(true)}>
                        + Record Movement
                    </Button>
                )}
            </div>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <StockFilters 
                        filters={filters} 
                        setFilters={setFilters} 
                        onSearch={handleSearch} 
                    />

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <StockMovementTable movements={movements} />
                            
                            {/* Pagination Controls */}
                            {pagination.last_page > 1 && (
                                <div className="d-flex justify-content-end mt-3">
                                    <Pagination>
                                        <Pagination.Prev 
                                            disabled={pagination.current_page === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)} 
                                        />
                                        <Pagination.Item active>{pagination.current_page}</Pagination.Item>
                                        <Pagination.Next 
                                            disabled={pagination.current_page === pagination.last_page}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modals */}
            <StockMovementForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                onSaveSuccess={onActionSuccess}
            />
        </Container>
    );
}