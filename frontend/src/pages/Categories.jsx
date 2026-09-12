import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Pagination, Card } from 'react-bootstrap';
import { categoryService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

import CategoryTable from '../components/categories/CategoryTable';
import CategoryForm from '../components/categories/CategoryForm';
import DeleteCategoryModal from '../components/categories/DeleteCategoryModal';

export default function Categories() {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    // Data State
    const [categories, setCategories] = useState([]);
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
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll({ 
                search, 
                page: currentPage,
                per_page: 10
            });
            setCategories(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories.');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        fetchCategories();
    };

    // Modal Handlers
    const openAddModal = () => {
        setSelectedCategory(null);
        setShowForm(true);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setShowForm(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDelete(true);
    };

    // Action Handlers
    const onActionSuccess = (message) => {
        setSuccessMsg(message);
        fetchCategories();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-bold mb-0">Categories</h2>
                {isAdmin && (
                    <Button variant="primary" onClick={openAddModal}>
                        + Add Category
                    </Button>
                )}
            </div>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch} className="d-flex mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="me-2"
                        />
                        <Button variant="outline-secondary" type="submit">Search</Button>
                    </Form>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <CategoryTable 
                                categories={categories} 
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
            <CategoryForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                categoryToEdit={selectedCategory}
                onSaveSuccess={() => onActionSuccess(selectedCategory ? 'Category updated successfully!' : 'Category created successfully!')}
            />

            <DeleteCategoryModal
                show={showDelete}
                handleClose={() => setShowDelete(false)}
                categoryToDelete={selectedCategory}
                onDeleteSuccess={() => onActionSuccess('Category deleted successfully!')}
            />
        </Container>
    );
}