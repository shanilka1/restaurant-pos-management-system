<?php

namespace App\Http\Controllers;

use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index(Request $request)
    {
        $query = RestaurantTable::with('currentOrder.orderItems.product');

        if ($request->has('section')) {
            $query->where('section', $request->section);
        }

        $tables = $query->orderBy('table_number')->get();
        return response()->json(['status' => 'success', 'data' => $tables]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|unique:restaurant_tables,table_number',
            'section' => 'required|string|in:main,outdoor,vip,bar',
            'capacity' => 'required|integer|min:1',
        ]);

        $table = RestaurantTable::create($validated);
        return response()->json(['status' => 'success', 'message' => 'Table created', 'data' => $table], 201);
    }

    public function update(Request $request, $id)
    {
        $table = RestaurantTable::findOrFail($id);
        $validated = $request->validate([
            'table_number' => 'sometimes|string|unique:restaurant_tables,table_number,' . $id,
            'section' => 'sometimes|string|in:main,outdoor,vip,bar',
            'capacity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|string|in:available,occupied,reserved,cleaning',
        ]);

        $table->update($validated);
        return response()->json(['status' => 'success', 'message' => 'Table updated', 'data' => $table]);
    }

    public function switchTable(Request $request)
    {
        $validated = $request->validate([
            'from_table_id' => 'required|exists:restaurant_tables,id',
            'to_table_id' => 'required|exists:restaurant_tables,id',
        ]);

        $fromTable = RestaurantTable::findOrFail($validated['from_table_id']);
        $toTable = RestaurantTable::findOrFail($validated['to_table_id']);

        if (!$fromTable->current_order_id) {
            return response()->json(['status' => 'error', 'message' => 'Source table has no active order'], 400);
        }

        if ($toTable->status === 'occupied') {
            return response()->json(['status' => 'error', 'message' => 'Destination table is already occupied'], 400);
        }

        $orderId = $fromTable->current_order_id;

        // Move order to destination table
        $toTable->update([
            'status' => 'occupied',
            'current_order_id' => $orderId,
        ]);

        $fromTable->update([
            'status' => 'available',
            'current_order_id' => null,
        ]);

        // Update order table reference
        if ($fromTable->currentOrder) {
            $fromTable->currentOrder->update(['table_id' => $toTable->id]);
        }

        return response()->json(['status' => 'success', 'message' => 'Table switched successfully']);
    }

    public function destroy($id)
    {
        $table = RestaurantTable::findOrFail($id);
        $table->delete();
        return response()->json(['status' => 'success', 'message' => 'Table deleted']);
    }
}
