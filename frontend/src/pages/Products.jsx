import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import { productService, categoryService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';
import DeleteProductModal from '../components/products/DeleteProductModal';

export default function Products() {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    // Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        // Fetch categories for the filter dropdown
        categoryService.getAll({ per_page: 100 }).then(res => setCategories(res.data.data)).catch(console.error);
    }, []);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search, categoryId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll({ 
                search,
                category_id: categoryId,
                page: currentPage,
                per_page: 10
            });
            setProducts(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch products.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        fetchProducts();
    };

    const handleCategoryFilter = (e) => {
        setCategoryId(e.target.value);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    // Modal Handlers
    const openAddModal = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDelete(true);
    };

    // Action Handlers
    const onActionSuccess = (message) => {
        setSuccessMsg(message);
        fetchProducts();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-bold mb-0">Products</h2>
                {isAdmin && (
                    <Button variant="primary" onClick={openAddModal}>
                        + Add Product
                    </Button>
                )}
            </div>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch} className="d-flex mb-3 gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Search by SKU or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                        <Form.Select 
                            value={categoryId} 
                            onChange={handleCategoryFilter}
                            style={{ maxWidth: '200px' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                        <Button variant="outline-secondary" type="submit">Search</Button>
                    </Form>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <ProductTable 
                                products={products} 
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
            <ProductForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                productToEdit={selectedProduct}
                onSaveSuccess={() => onActionSuccess(selectedProduct ? 'Product updated successfully!' : 'Product created successfully!')}
            />

            <DeleteProductModal
                show={showDelete}
                handleClose={() => setShowDelete(false)}
                productToDelete={selectedProduct}
                onDeleteSuccess={() => onActionSuccess('Product deleted successfully!')}
            />
        </Container>
    );
}