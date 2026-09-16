<?php

namespace App\Http\Controllers;

use App\Models\HeldOrder;
use Illuminate\Http\Request;

class HeldOrderController extends Controller
{
    public function index(Request $request)
    {
        $heldOrders = HeldOrder::with('customer')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $heldOrders]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference_name' => 'nullable|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'cart_data' => 'required|array',
            'notes' => 'nullable|string',
        ]);

        $heldOrder = HeldOrder::create([
            'user_id' => $request->user()->id,
            'customer_id' => $validated['customer_id'] ?? null,
            'reference_name' => $validated['reference_name'] ?? ('Hold #' . time()),
            'cart_data' => $validated['cart_data'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Cart held successfully', 'data' => $heldOrder], 201);
    }

    public function destroy(Request $request, $id)
    {
        $heldOrder = HeldOrder::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $heldOrder->delete();

        return response()->json(['status' => 'success', 'message' => 'Held cart deleted']);
    }
}
