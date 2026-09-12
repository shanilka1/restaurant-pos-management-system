<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index(Request $request)
    {
        $today = Carbon::today();
        
        // Key Metrics
        $totalSales = Order::where('status', 'completed')->sum('total_amount');
        $todaySales = Order::where('status', 'completed')->whereDate('created_at', $today)->sum('total_amount');
        
        $totalOrders = Order::count();
        $todayOrders = Order::whereDate('created_at', $today)->count();
        
        $totalProducts = Product::where('is_active', true)->count();
        $totalCustomers = Customer::count();

        // Low stock products (threshold <= 10)
        $lowStockProducts = Product::where('is_active', true)
                                   ->where('stock_quantity', '<=', 10)
                                   ->orderBy('stock_quantity', 'asc')
                                   ->take(5)
                                   ->get(['id', 'name', 'sku', 'stock_quantity']);

        // Recent Orders
        $recentOrders = Order::with(['customer', 'user'])
                             ->latest()
                             ->take(5)
                             ->get();

        // Sales for the last 7 days for the chart
        // Since sqlite/mysql date grouping can vary, we will fetch and group in PHP for simplicity 
        // given this is a small POS, or use raw DB query. 
        // Using Eloquent with DB::raw is better for performance.
        
        $sevenDaysAgo = Carbon::today()->subDays(6); // Today + 6 previous days = 7 days
        
        $chartDataRaw = Order::where('status', 'completed')
            ->whereDate('created_at', '>=', $sevenDaysAgo)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get();

        // Fill in missing days with 0
        $salesChart = [];
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::today()->subDays(6 - $i)->format('Y-m-d');
            $found = $chartDataRaw->firstWhere('date', $date);
            $salesChart[] = [
                'date' => $date,
                'total' => $found ? (float)$found->total : 0
            ];
        }

        return response()->json([
            'data' => [
                'total_sales' => (float)$totalSales,
                'today_sales' => (float)$todaySales,
                'total_orders' => $totalOrders,
                'today_orders' => $todayOrders,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'low_stock_products' => $lowStockProducts,
                'recent_orders' => $recentOrders,
                'sales_chart' => $salesChart
            ]
        ]);
    }
}
