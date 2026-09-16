import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { ingredientService, productService } from '../services/api';

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [recipeItems, setRecipeItems] = useState([]);

    const [name, setName] = useState('');
    const [unit, setUnit] = useState('kg');
    const [currentStock, setCurrentStock] = useState('10');
    const [minStockAlert, setMinStockAlert] = useState('2');
    const [unitCost, setUnitCost] = useState('1.50');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ingData, prodData] = await Promise.all([
                ingredientService.getAll(),
                productService.getAll(),
            ]);
            setIngredients(ingData.data.data || []);
            setProducts(prodData.data.data || prodData.data || []);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateIngredient = async (e) => {
        e.preventDefault();
        try {
            await ingredientService.create({
                name,
                unit,
                current_stock: parseFloat(currentStock),
                min_stock_alert: parseFloat(minStockAlert),
                unit_cost: parseFloat(unitCost),
            });
            setSuccess('Raw ingredient added to inventory!');
            setShowModal(false);
            setName('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add ingredient');
        }
    };

    const handleOpenRecipeModal = async (product) => {
        setSelectedProduct(product);
        try {
            const res = await ingredientService.getRecipes(product.id);
            const existing = res.data.data || [];
            if (existing.length > 0) {
                setRecipeItems(existing.map(r => ({ ingredient_id: r.ingredient_id, quantity_required: r.quantity_required })));
            } else {
                setRecipeItems([{ ingredient_id: '', quantity_required: 1 }]);
            }
            setShowRecipeModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddRecipeRow = () => {
        setRecipeItems([...recipeItems, { ingredient_id: '', quantity_required: 1 }]);
    };

    const handleRemoveRecipeRow = (index) => {
        setRecipeItems(recipeItems.filter((_, i) => i !== index));
    };

    const handleSaveRecipes = async (e) => {
        e.preventDefault();
        try {
            const valid = recipeItems.filter(r => r.ingredient_id && r.quantity_required > 0);
            await ingredientService.saveRecipes(selectedProduct.id, valid);
            setSuccess(`Recipe saved for ${selectedProduct.name}`);
            setShowRecipeModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save recipe');
        }
    };

    return (
        <Container fluid className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-0">🥩 Raw Ingredients & Recipe Management (BOM)</h3>
                    <p className="text-muted small mb-0">Track kitchen raw inventory & link recipes to automatically deduct stock on sale</p>
                </div>
                <Button variant="primary" className="fw-bold" onClick={() => setShowModal(true)}>
                    ➕ Add Raw Ingredient
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

            <Row className="g-4">
                <Col md={7}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-light fw-bold py-3">
                            📦 Kitchen Raw Materials Inventory
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center py-5"><Spinner animation="border" /></div>
                            ) : (
                                <Table responsive hover className="align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Ingredient Name</th>
                                            <th>Current Stock</th>
                                            <th>Min Alert Threshold</th>
                                            <th>Unit Cost</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingredients.map((ing) => {
                                            const isLow = parseFloat(ing.current_stock) <= parseFloat(ing.min_stock_alert);
                                            return (
                                                <tr key={ing.id}>
                                                    <td className="fw-bold">{ing.name}</td>
                                                    <td className="fw-bold fs-6">
                                                        {parseFloat(ing.current_stock).toFixed(2)} {ing.unit}
                                                    </td>
                                                    <td>{parseFloat(ing.min_stock_alert).toFixed(2)} {ing.unit}</td>
                                                    <td>${parseFloat(ing.unit_cost).toFixed(2)}</td>
                                                    <td>
                                                        {isLow ? (
                                                            <Badge bg="danger">⚠️ LOW STOCK</Badge>
                                                        ) : (
                                                            <Badge bg="success">IN STOCK</Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-light fw-bold py-3">
                            📖 Product Recipe (BOM) Linkage
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th className="text-end">Recipe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            <td className="fw-bold">{p.name}</td>
                                            <td>${parseFloat(p.price).toFixed(2)}</td>
                                            <td className="text-end">
                                                <Button size="sm" variant="outline-primary" onClick={() => handleOpenRecipeModal(p)}>
                                                    ⚙️ Manage Recipe
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Create Ingredient Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="h5">➕ Add Kitchen Raw Ingredient</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateIngredient}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Ingredient Name</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Flour, Cheese, Beef Patty" value={name} onChange={e => setName(e.target.value)} required />
                        </Form.Group>
                        <Row className="g-2">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Unit of Measurement</Form.Label>
                                    <Form.Select value={unit} onChange={e => setUnit(e.target.value)}>
                                        <option value="kg">Kilograms (kg)</option>
                                        <option value="g">Grams (g)</option>
                                        <option value="liter">Liters (L)</option>
                                        <option value="ml">Milliliters (ml)</option>
                                        <option value="pcs">Pieces / Units (pcs)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Initial Stock</Form.Label>
                                    <Form.Control type="number" step="0.001" value={currentStock} onChange={e => setCurrentStock(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Min Stock Alert</Form.Label>
                                    <Form.Control type="number" step="0.001" value={minStockAlert} onChange={e => setMinStockAlert(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Unit Cost ($)</Form.Label>
                                    <Form.Control type="number" step="0.01" value={unitCost} onChange={e => setUnitCost(e.target.value)} required />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Ingredient</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Recipe Modal */}
            <Modal show={showRecipeModal} onHide={() => setShowRecipeModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="h5">📖 Edit Recipe for: <strong>{selectedProduct?.name}</strong></Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveRecipes}>
                    <Modal.Body>
                        <p className="text-muted small">Specify which ingredients and amounts are used whenever 1 portion of this product is sold.</p>
                        {recipeItems.map((item, index) => (
                            <Row key={index} className="g-2 mb-2 align-items-center">
                                <Col md={6}>
                                    <Form.Select
                                        value={item.ingredient_id}
                                        onChange={(e) => {
                                            const newItems = [...recipeItems];
                                            newItems[index].ingredient_id = e.target.value;
                                            setRecipeItems(newItems);
                                        }}
                                        required
                                    >
                                        <option value="">Select ingredient...</option>
                                        {ingredients.map(ing => (
                                            <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="number"
                                        step="0.001"
                                        placeholder="Quantity Required"
                                        value={item.quantity_required}
                                        onChange={(e) => {
                                            const newItems = [...recipeItems];
                                            newItems[index].quantity_required = e.target.value;
                                            setRecipeItems(newItems);
                                        }}
                                        required
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveRecipeRow(index)}>
                                        ❌ Remove
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-success" size="sm" className="mt-2 fw-bold" onClick={handleAddRecipeRow}>
                            ➕ Add Ingredient Line
                        </Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRecipeModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Recipe Configuration</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Ingredients;
