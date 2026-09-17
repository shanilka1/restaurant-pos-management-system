import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

import StatCard from '../components/dashboard/StatCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockProducts from '../components/dashboard/LowStockProducts';
import SalesChart from '../components/dashboard/SalesChart';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getStats();
            setStats(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mt-4">
                {error}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-slate-800 font-[Poppins]">Dashboard Overview</h2>
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Today's Sales" 
                    value={`Rs {stats.today_sales.toFixed(2)}`} 
                    variant="primary" 
                />
                <StatCard 
                    title="Total Sales" 
                    value={`Rs {stats.total_sales.toFixed(2)}`} 
                    variant="success" 
                />
                <StatCard 
                    title="Today's Orders" 
                    value={stats.today_orders} 
                    variant="info" 
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats.total_orders} 
                    variant="warning" 
                />
                <StatCard 
                    title="Active Products" 
                    value={stats.total_products} 
                    variant="dark" 
                />
                <StatCard 
                    title="Total Customers" 
                    value={stats.total_customers} 
                    variant="secondary" 
                />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    <SalesChart data={stats.sales_chart} />
                    <RecentOrders orders={stats.recent_orders} />
                </div>
                <div className="lg:col-span-1">
                    <LowStockProducts products={stats.low_stock_products} />
                </div>
            </div>
        </div>
    );
}