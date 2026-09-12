import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import { customerService } from '../services/api';

import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import DeleteCustomerModal from '../components/customers/DeleteCustomerModal';

export default function Customers() {
    // Data State
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerService.getAll({ 
                search,
                page: currentPage,
                per_page: 10
            });
            setCustomers(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch customers.');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        fetchCustomers();
    };

    // Modal Handlers
    const openAddModal = () => {
        setSelectedCustomer(null);
        setShowForm(true);
    };

    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        setShowForm(true);
    };

    const openDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setShowDelete(true);
    };

    // Action Handlers
    const onActionSuccess = (message) => {
        setSuccessMsg(message);
        fetchCustomers();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-bold mb-0">Customers</h2>
                <Button variant="primary" onClick={openAddModal}>
                    + Add Customer
                </Button>
            </div>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch} className="d-flex mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="me-2"
                            style={{ maxWidth: '400px' }}
                        />
                        <Button variant="outline-secondary" type="submit">Search</Button>
                    </Form>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <CustomerTable 
                                customers={customers} 
                                onEdit={openEditModal} 
                                onDelete={openDeleteModal} 
                            />
                            
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
            <CustomerForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                customerToEdit={selectedCustomer}
                onSaveSuccess={() => onActionSuccess(selectedCustomer ? 'Customer updated successfully!' : 'Customer created successfully!')}
            />

            <DeleteCustomerModal
                show={showDelete}
                handleClose={() => setShowDelete(false)}
                customerToDelete={selectedCustomer}
                onDeleteSuccess={() => onActionSuccess('Customer deleted successfully!')}
            />
        </Container>
    );
}