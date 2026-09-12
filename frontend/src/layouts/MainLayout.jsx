import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column vh-100">
            {/* Top Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/dashboard">Mini POS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link as="span" className="text-light me-3">
                                Welcome, {user?.name || 'User'} ({user?.role || 'Role'})
                            </Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content Area */}
            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    {/* Sidebar */}
                    <Col md={2} className="bg-light p-3 h-100 overflow-auto border-end">
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/pos">POS Terminal</Nav.Link>
                            <hr />
                            <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                            <Nav.Link as={Link} to="/customers">Customers</Nav.Link>
                            <hr />
                            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
                            <Nav.Link as={Link} to="/products">Products</Nav.Link>
                            <Nav.Link as={Link} to="/stock">Stock</Nav.Link>
                            <hr />
                            <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                        </Nav>
                    </Col>

                    {/* Page Content */}
                    <Col md={10} className="p-4 h-100 overflow-auto">
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MainLayout;
