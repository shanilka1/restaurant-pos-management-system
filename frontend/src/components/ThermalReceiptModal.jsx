import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ThermalReceiptModal = ({ show, onHide, order }) => {
    const receiptRef = useRef();

    if (!order) return null;

    const handlePrint = () => {
        const printContent = receiptRef.current.innerHTML;
        const windowPrint = window.open('', '', 'left=0,top=0,width=400,height=600,toolbar=0,scrollbars=0,status=0');
        windowPrint.document.write(`
            <html>
                <head>
                    <title>Print Receipt #${order.id}</title>
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body {
                            font-family: 'Courier New', Courier, monospace;
                            width: 78mm;
                            margin: 0 auto;
                            padding: 10px;
                            font-size: 12px;
                            color: #000;
                        }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .text-left { text-left: left; }
                        .header { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                        .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
                        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
                        th, td { font-size: 11px; padding: 2px 0; }
                        .bold { font-weight: bold; }
                        .total-row { font-size: 13px; font-weight: bold; }
                        .footer { margin-top: 15px; font-size: 10px; text-align: center; border-top: 1px dashed #000; padding-top: 5px; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        windowPrint.document.close();
        windowPrint.focus();
        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 300);
    };

    const subtotal = parseFloat(order.subtotal || order.total_amount || 0);
    const tax = parseFloat(order.tax_amount || 0);
    const service = parseFloat(order.service_charge || 0);
    const discount = parseFloat(order.discount_amount || 0);
    const tip = parseFloat(order.tip_amount || 0);
    const grandTotal = parseFloat(order.total_amount || 0);
    const paid = parseFloat(order.paid_amount || grandTotal);
    const change = parseFloat(order.change_amount || 0);

    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="h6 mb-0">🧾 Thermal Receipt Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3 bg-light">
                <div ref={receiptRef} className="bg-white p-3 border rounded shadow-sm font-monospace text-dark style-receipt">
                    <div className="header text-center">
                        <h5 className="fw-bold mb-0">🍔 GOURMET RESTAURANT</h5>
                        <p className="mb-0 small text-muted">123 Culinary Avenue, Food City</p>
                        <p className="mb-0 small text-muted">Tel: +1 (555) 019-2834</p>
                        <div className="divider" />
                        <div className="d-flex justify-content-between small">
                            <span>Receipt #: <strong>#{order.id}</strong></span>
                            <span>{new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="d-flex justify-content-between small">
                            <span>Date: {new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                            <span>Type: <strong className="text-uppercase">{order.order_type || 'Takeaway'}</strong></span>
                        </div>
                        {order.table && (
                            <div className="text-start small fw-bold text-primary mt-1">
                                Table: {order.table.table_number} ({order.table.section})
                            </div>
                        )}
                        {order.customer && (
                            <div className="text-start small text-muted">
                                Customer: {order.customer.name}
                            </div>
                        )}
                    </div>

                    <table className="w-100 mb-2">
                        <thead>
                            <tr className="border-bottom border-secondary">
                                <th className="text-start">Item</th>
                                <th className="text-center">Qty</th>
                                <th className="text-end">Price</th>
                                <th className="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.orderItems || []).map((item, idx) => (
                                <tr key={idx} className="border-bottom border-light">
                                    <td className="text-start pe-1">
                                        <div>{item.product ? item.product.name : 'Item'}</div>
                                        {item.notes && <div className="small text-muted fst-italic">Note: {item.notes}</div>}
                                    </td>
                                    <td className="text-center align-top">{item.quantity}</td>
                                    <td className="text-end align-top">Rs {parseFloat(item.unit_price).toFixed(2)}</td>
                                    <td className="text-end align-top fw-bold">Rs {parseFloat(item.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="border-top border-dashed pt-2 small">
                        <div className="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>Rs {subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="d-flex justify-content-between text-danger">
                                <span>Discount:</span>
                                <span>-Rs ${discount.toFixed(2)}</span>
                            </div>
                        )}
                        {tax > 0 && (
                            <div className="d-flex justify-content-between text-muted">
                                <span>Tax (VAT):</span>
                                <span>+Rs ${tax.toFixed(2)}</span>
                            </div>
                        )}
                        {service > 0 && (
                            <div className="d-flex justify-content-between text-muted">
                                <span>Service Charge:</span>
                                <span>+Rs ${service.toFixed(2)}</span>
                            </div>
                        )}
                        {tip > 0 && (
                            <div className="d-flex justify-content-between text-success">
                                <span>Tip:</span>
                                <span>+Rs ${tip.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="d-flex justify-content-between fw-bold fs-6 border-top border-dark pt-1 mt-1">
                            <span>TOTAL:</span>
                            <span>Rs {grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between text-muted mt-1">
                            <span>Payment ({order.payment_method || 'Cash'}):</span>
                            <span>Rs {paid.toFixed(2)}</span>
                        </div>
                        {change > 0 && (
                            <div className="d-flex justify-content-between fw-bold text-success">
                                <span>Change Due:</span>
                                <span>Rs {change.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="footer mt-3 text-center small text-muted">
                        <p className="mb-0 fw-bold">Thank You For Dining With Us! ❤️</p>
                        <p className="mb-0 text-break">Please Come Again</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handlePrint}>🖨️ Print Receipt</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ThermalReceiptModal;
