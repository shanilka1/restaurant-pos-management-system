<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class KitchenController extends Controller
{
    public function queue(Request $request)
    {
        $orders = Order::with(['orderItems.product', 'table', 'customer'])
            ->whereIn('kitchen_status', ['pending', 'in_kitchen', 'ready'])
            ->whereIn('status', ['pending', 'processing', 'completed'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $orders]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'kitchen_status' => 'required|in:pending,in_kitchen,ready,served',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['kitchen_status' => $validated['kitchen_status']]);

        // Also update all order items if order marked served/ready
        if (in_array($validated['kitchen_status'], ['ready', 'served'])) {
            $order->orderItems()->update(['item_status' => $validated['kitchen_status']]);
        }

        return response()->json(['status' => 'success', 'message' => 'Kitchen order status updated', 'data' => $order]);
    }

    public function updateItemStatus(Request $request, $itemId)
    {
        $validated = $request->validate([
            'item_status' => 'required|in:pending,in_kitchen,ready,served',
        ]);

        $item = OrderItem::findOrFail($itemId);
        $item->update(['item_status' => $validated['item_status']]);

        // Check if all items in the order have reached this status
        $order = $item->order;
        $statuses = $order->orderItems()->pluck('item_status')->unique()->toArray();

        if (count($statuses) === 1) {
            $order->update(['kitchen_status' => $statuses[0]]);
        } else if (in_array('in_kitchen', $statuses)) {
            $order->update(['kitchen_status' => 'in_kitchen']);
        }

        return response()->json(['status' => 'success', 'message' => 'Item status updated']);
    }
}
