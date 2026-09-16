<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\RestaurantTable;
use App\Models\Shift;
use App\Models\Ingredient;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'user', 'table', 'shift', 'orderItems.product']);

        if ($request->has('search') && !empty($request->search)) {
            $query->where('id', $request->search);
        }

        if ($request->has('customer_id') && !empty($request->customer_id)) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('order_type') && !empty($request->order_type)) {
            $query->where('order_type', $request->order_type);
        }

        if ($request->has('date') && !empty($request->date)) {
            $query->whereDate('created_at', $request->date);
        }

        $perPage = $request->input('per_page', 15);
        $orders = $query->latest()->paginate($perPage);

        return response()->json($orders);
    }

    /**
     * Store a newly created order (Checkout).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.modifiers' => 'nullable|array',
            'items.*.notes' => 'nullable|string',
            'customer_id' => 'nullable|exists:customers,id',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'table_id' => 'nullable|exists:restaurant_tables,id',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'service_charge' => 'nullable|numeric|min:0',
            'tip_amount' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string',
            'split_payments' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        try {
            $result = DB::transaction(function () use ($request, $validated) {
                $user = $request->user();
                $items = $validated['items'];

                // Get open shift for user if any
                $openShift = Shift::where('user_id', $user->id)->where('status', 'open')->first();

                $subtotal = 0;
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

                    $itemSubtotal = $product->price * $item['quantity'];
                    $subtotal += $itemSubtotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->price,
                        'subtotal' => $itemSubtotal,
                        'modifiers' => $item['modifiers'] ?? null,
                        'notes' => $item['notes'] ?? null,
                        'item_status' => 'pending',
                    ];

                    $stockUpdates[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'previous_stock' => $product->stock_quantity,
                        'new_stock' => $product->stock_quantity - $item['quantity'],
                    ];
                }

                $discount = $validated['discount_amount'] ?? 0;
                $tax = $validated['tax_amount'] ?? 0;
                $service = $validated['service_charge'] ?? 0;
                $tip = $validated['tip_amount'] ?? 0;

                $totalAmount = max(0, $subtotal - $discount) + $tax + $service + $tip;
                $paidAmount = $validated['paid_amount'] ?? $totalAmount;
                $changeAmount = max(0, $paidAmount - $totalAmount);

                // Create Order
                $order = Order::create([
                    'user_id' => $user->id,
                    'customer_id' => $validated['customer_id'] ?? null,
                    'order_type' => $validated['order_type'],
                    'table_id' => $validated['table_id'] ?? null,
                    'subtotal' => $subtotal,
                    'tax_amount' => $tax,
                    'service_charge' => $service,
                    'discount_amount' => $discount,
                    'tip_amount' => $tip,
                    'total_amount' => $totalAmount,
                    'paid_amount' => $paidAmount,
                    'change_amount' => $changeAmount,
                    'status' => 'completed',
                    'kitchen_status' => 'pending',
                    'payment_method' => $validated['payment_method'],
                    'split_payments' => $validated['split_payments'] ?? null,
                    'shift_id' => $openShift ? $openShift->id : null,
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Create OrderItems & deduct finished item stock + raw ingredient stock
                foreach ($orderItemsData as $index => $itemData) {
                    $itemData['order_id'] = $order->id;
                    OrderItem::create($itemData);

                    $stockInfo = $stockUpdates[$index];
                    $product = $stockInfo['product'];

                    // Deduct product stock
                    $product->stock_quantity = $stockInfo['new_stock'];
                    $product->save();

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

                    // Deduct Raw Ingredient Stock if recipes exist
                    foreach ($product->recipes as $recipe) {
                        $ingredient = Ingredient::lockForUpdate()->find($recipe->ingredient_id);
                        if ($ingredient) {
                            $totalDeduct = $recipe->quantity_required * $stockInfo['quantity'];
                            $ingredient->current_stock = max(0, $ingredient->current_stock - $totalDeduct);
                            $ingredient->save();
                        }
                    }
                }

                // Update Table Status if attached
                if ($order->table_id) {
                    $table = RestaurantTable::find($order->table_id);
                    if ($table) {
                        $table->update([
                            'status' => 'occupied',
                            'current_order_id' => $order->id,
                        ]);
                    }
                }

                // Award Customer Loyalty points (1 pt per 10 currency units)
                if ($order->customer_id) {
                    $customer = Customer::find($order->customer_id);
                    if ($customer) {
                        $earned = floor($order->total_amount / 10);
                        $customer->increment('loyalty_points', $earned);
                    }
                }

                return $order;
            });

            $result->load(['customer', 'user', 'table', 'orderItems.product']);

            return response()->json([
                'status' => 'success',
                'message' => 'Order processed successfully',
                'data' => $result
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to process order',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $order = Order::with(['customer', 'user', 'table', 'shift', 'orderItems.product'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['data' => $order]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::with('orderItems')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $newStatus = $validated['status'];

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

                    // Free table if associated
                    if ($order->table_id) {
                        RestaurantTable::where('id', $order->table_id)->update([
                            'status' => 'available',
                            'current_order_id' => null,
                        ]);
                    }
                });
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Failed to cancel order.',
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            $order->status = $newStatus;
            $order->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Order status updated',
            'data' => $order->fresh(['customer', 'user', 'table', 'orderItems.product'])
        ]);
    }
}
