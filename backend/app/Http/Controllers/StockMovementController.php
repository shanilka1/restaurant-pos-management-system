<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use App\Http\Requests\StoreStockMovementRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    /**
     * Display a listing of stock movements.
     */
    public function index(Request $request)
    {
        $query = StockMovement::with(['product', 'user']);

        // Filter by product_id
        if ($request->has('product_id') && !empty($request->product_id)) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by type
        if ($request->has('type') && !empty($request->type)) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $movements = $query->latest()->paginate($perPage);

        return response()->json($movements);
    }

    /**
     * Store a newly created stock movement.
     */
    public function store(StoreStockMovementRequest $request)
    {
        try {
            $result = DB::transaction(function () use ($request) {
                $product = Product::lockForUpdate()->findOrFail($request->product_id);
                
                $previousStock = $product->stock_quantity;
                $quantity = $request->quantity;
                $type = $request->type;
                
                $newStock = $previousStock;
                
                if ($type === 'in') {
                    $newStock = $previousStock + $quantity;
                } elseif ($type === 'out') {
                    if ($previousStock < $quantity) {
                        throw new \Exception('Insufficient stock available');
                    }
                    $newStock = $previousStock - $quantity;
                } elseif ($type === 'adjustment') {
                    // Assuming adjustment overrides the stock or adjusts it.
                    // Let's assume adjustment sets the stock to the exact quantity provided.
                    // Or if it means delta adjustment, the prompt says "update the stock according to the adjustment logic".
                    // For simplicity, let's assume 'adjustment' means setting it directly.
                    // If it meant a positive/negative adjustment, it would be 'in'/'out'.
                    // I will set the stock directly for adjustment.
                    $newStock = $quantity; 
                    // Actually, usually an adjustment has a quantity and we might want to track the delta.
                    // But I will set it to the quantity as the easiest logic.
                }

                // Create movement
                $movement = StockMovement::create([
                    'product_id' => $product->id,
                    'user_id' => $request->user()->id,
                    'type' => $type,
                    'quantity' => $quantity,
                    'previous_stock' => $previousStock,
                    'new_stock' => $newStock,
                    'reason' => $request->reason,
                ]);

                // Update product
                $product->stock_quantity = $newStock;
                $product->save();

                return $movement;
            });

            $result->load(['product', 'user']);

            return response()->json([
                'message' => 'Stock movement recorded successfully',
                'data' => $result
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process stock movement',
                'error' => $e->getMessage()
            ], 422); // 422 Unprocessable Entity
        }
    }

    /**
     * Display the specified stock movement.
     */
    public function show($id)
    {
        $movement = StockMovement::with(['product', 'user'])->find($id);

        if (!$movement) {
            return response()->json(['message' => 'Stock movement not found'], 404);
        }

        return response()->json([
            'data' => $movement
        ]);
    }
}
