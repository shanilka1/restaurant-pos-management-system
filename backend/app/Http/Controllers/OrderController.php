<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'user', 'orderItems.product']);

        // Search by order ID
        if ($request->has('search') && !empty($request->search)) {
            $query->where('id', $request->search);
        }

        // Filter by customer
        if ($request->has('customer_id') && !empty($request->customer_id)) {
            $query->where('customer_id', $request->customer_id);
        }

        // Filter by status
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('date') && !empty($request->date)) {
            $query->whereDate('created_at', $request->date);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $orders = $query->latest()->paginate($perPage);

        return response()->json($orders);
    }

    /**
     * Store a newly created order (Checkout).
     */
    public function store(StoreOrderRequest $request)
    {
        try {
            $result = DB::transaction(function () use ($request) {
                $user = $request->user();
                $items = $request->items;
                $totalAmount = 0;

                // Step 1: Pre-calculate total and lock products
                $orderItemsData = [];
                $stockUpdates = [];
                
                foreach ($items as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                    
                    if (!$product->is_active) {
                        throw new \Exception("Product {$product->name} is not active.");
                    }
                    
                    if ($product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for product {$product->name}.");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $totalAmount += $subtotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->price,
                        'subtotal' => $subtotal,
                    ];

                    $stockUpdates[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'previous_stock' => $product->stock_quantity,
                        'new_stock' => $product->stock_quantity - $item['quantity'],
                    ];
                }

                // Step 2: Create Order
                $order = Order::create([
                    'user_id' => $user->id,
                    'customer_id' => $request->customer_id,
                    'total_amount' => $totalAmount,
                    'status' => 'completed', // For POS, usually completed immediately.
                ]);

                // Step 3: Create OrderItems and process Stock
                foreach ($orderItemsData as $index => $itemData) {
                    $itemData['order_id'] = $order->id;
                    OrderItem::create($itemData);

                    $stockInfo = $stockUpdates[$index];
                    $product = $stockInfo['product'];

                    // Update Product Stock
                    $product->stock_quantity = $stockInfo['new_stock'];
                    $product->save();

                    // Record Stock Movement
                    StockMovement::create([
                        'product_id' => $product->id,
                        'user_id' => $user->id,
                        'order_id' => $order->id,
                        'type' => 'sale',
                        'quantity' => $stockInfo['quantity'],
                        'previous_stock' => $stockInfo['previous_stock'],
                        'new_stock' => $stockInfo['new_stock'],
                        'reason' => 'POS Sale',
                    ]);
                }

                return $order;
            });

            $result->load(['customer', 'user', 'orderItems.product']);

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $result
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $order = Order::with(['customer', 'user', 'orderItems.product'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'data' => $order
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order = Order::with('orderItems')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $newStatus = $request->status;

        // If trying to cancel an already cancelled order
        if ($newStatus === 'cancelled' && $order->status === 'cancelled') {
            return response()->json([
                'message' => 'Order is already cancelled.'
            ], 422);
        }

        // Logic for Cancellation
        if ($newStatus === 'cancelled' && $order->status !== 'cancelled') {
            try {
                DB::transaction(function () use ($order, $request) {
                    $user = $request->user();

                    foreach ($order->orderItems as $item) {
                        $product = Product::lockForUpdate()->find($item->product_id);
                        if ($product) {
                            $previousStock = $product->stock_quantity;
                            $newStock = $previousStock + $item->quantity;

                            $product->stock_quantity = $newStock;
                            $product->save();

                            StockMovement::create([
                                'product_id' => $product->id,
                                'user_id' => $user->id,
                                'order_id' => $order->id,
                                'type' => 'return',
                                'quantity' => $item->quantity,
                                'previous_stock' => $previousStock,
                                'new_stock' => $newStock,
                                'reason' => 'Order Cancelled',
                            ]);
                        }
                    }

                    $order->status = 'cancelled';
                    $order->save();
                });
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Failed to cancel order and restore stock.',
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            // For other status transitions
            $order->status = $newStatus;
            $order->save();
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => $order->fresh(['customer', 'user', 'orderItems.product'])
        ]);
    }
}
