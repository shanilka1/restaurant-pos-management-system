import React, { useState, useEffect } from 'react';
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
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Business Analytics & Reports</h2>

            <ReportFilters 
                startDate={startDate} 
                endDate={endDate} 
                setStartDate={setStartDate} 
                setEndDate={setEndDate} 
                onFilter={fetchReports} 
                loading={loading}
            />

            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-6 font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                    <p className="mt-3 text-slate-500 font-medium">Crunching numbers...</p>
                </div>
            ) : (
                <div className="space-y-6 mt-6">
                    <SalesSummary summary={salesSummary} />
                    
                    <SalesChart data={dailySales} />
                    
                    <ProductReportTable products={productReport} />
                </div>
            )}
        </div>
    );
}