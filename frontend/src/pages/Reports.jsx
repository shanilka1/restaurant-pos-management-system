import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { reportService } from '../services/api';

import ReportFilters from '../components/reports/ReportFilters';
import SalesSummary from '../components/reports/SalesSummary';
import SalesChart from '../components/reports/SalesChart';
import ProductReportTable from '../components/reports/ProductReportTable';

export default function Reports() {
    // Determine sensible default dates (Last 30 days up to today)
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(priorDate.getDate() - 30);
    
    const [startDate, setStartDate] = useState(priorDate.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    // Data State
    const [salesSummary, setSalesSummary] = useState(null);
    const [dailySales, setDailySales] = useState([]);
    const [productReport, setProductReport] = useState([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchReports = async () => {
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be after end date.');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const params = { start_date: startDate, end_date: endDate };
            
            // Execute both API calls concurrently for speed
            const [salesRes, productsRes] = await Promise.all([
                reportService.getSales(params),
                reportService.getProducts(params)
            ]);

            setSalesSummary(salesRes.data.summary);
            setDailySales(salesRes.data.daily_sales);
            setProductReport(productsRes.data.data);
            
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You do not have permission to view reports.');
            } else {
                setError('Failed to fetch report data. Please check your network or try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-4">
            <h2 className="text-secondary fw-bold mb-4">Business Analytics & Reports</h2>

            <ReportFilters 
                startDate={startDate} 
                endDate={endDate} 
                setStartDate={setStartDate} 
                setEndDate={setEndDate} 
                onFilter={fetchReports} 
                loading={loading}
            />

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Crunching numbers...</p>
                </div>
            ) : (
                <>
                    <SalesSummary summary={salesSummary} />
                    
                    <SalesChart data={dailySales} />
                    
                    <ProductReportTable products={productReport} />
                </>
            )}
        </Container>
    );
}