import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Pagination } from 'react-bootstrap';
import { orderService } from '../services/api';

import OrderTable from '../components/orders/OrderTable';
import OrderFilters from '../components/orders/OrderFilters';
import OrderDetails from '../components/orders/OrderDetails';

export default function Orders() {
    // Data State
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [filters, setFilters] = useState({ search: '', customer_id: '', status: '', date: '' });
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAll({ 
                ...filters,
                page: currentPage,
                per_page: 10
            });
            const p = response.data;
            setOrders(p.data || []);
            setPagination({
                current_page: p.current_page || 1,
                last_page: p.last_page || 1
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (currentPage === 1) {
            fetchOrders();
        } else {
            setCurrentPage(1); // Effect triggers fetch
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrderId(order.id);
        setShowDetails(true);
    };

    const onUpdateSuccess = () => {
        setSuccessMsg('Order updated successfully.');
        fetchOrders();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-bold mb-0">Order Management</h2>
            </div>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <OrderFilters 
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
                            <OrderTable 
                                orders={orders} 
                                onViewDetails={handleViewDetails} 
                            />
                            
                            {/* Pagination */}
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
            <OrderDetails 
                show={showDetails} 
                handleClose={() => setShowDetails(false)}
                orderId={selectedOrderId}
                onUpdateSuccess={onUpdateSuccess}
            />
        </Container>
    );
}