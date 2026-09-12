<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get Sales Report Data (Summary + Daily Breakdown)
     */
    public function sales(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        // We only calculate based on 'completed' orders as per business logic
        $baseQuery = DB::table('orders')
            ->where('status', 'completed')
            ->whereNull('deleted_at') // If using soft deletes
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate);

        // Calculate Summary
        $summary = (clone $baseQuery)->select(
            DB::raw('COUNT(id) as total_orders'),
            DB::raw('COALESCE(SUM(total_amount), 0) as total_sales')
        )->first();

        // Calculate Total Items Sold in these orders
        $totalItems = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->whereNull('orders.deleted_at')
            ->whereDate('orders.created_at', '>=', $startDate)
            ->whereDate('orders.created_at', '<=', $endDate)
            ->sum('order_items.quantity');

        // Calculate Average Order Value
        $avgOrderValue = $summary->total_orders > 0 
            ? $summary->total_sales / $summary->total_orders 
            : 0;

        // Daily Breakdown for the Chart
        // Group by DATE(created_at)
        $dailySales = (clone $baseQuery)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(id) as orders'),
                DB::raw('COALESCE(SUM(total_amount), 0) as sales')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'summary' => [
                'total_sales' => (float) $summary->total_sales,
                'total_orders' => (int) $summary->total_orders,
                'total_items' => (int) $totalItems,
                'average_order_value' => (float) $avgOrderValue,
            ],
            'daily_sales' => $dailySales
        ]);
    }

    /**
     * Get Product Performance Report
     */
    public function products(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        $productsReport = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.status', 'completed')
            ->whereNull('orders.deleted_at')
            ->whereDate('orders.created_at', '>=', $startDate)
            ->whereDate('orders.created_at', '<=', $endDate)
            ->select(
                'products.id',
                'products.name as product_name',
                'products.sku',
                'categories.name as category_name',
                DB::raw('SUM(order_items.quantity) as quantity_sold'),
                DB::raw('SUM(order_items.subtotal) as sales_amount')
            )
            ->groupBy('products.id', 'products.name', 'products.sku', 'categories.name')
            ->orderByDesc('quantity_sold')
            ->get();

        return response()->json([
            'data' => $productsReport
        ]);
    }
}
