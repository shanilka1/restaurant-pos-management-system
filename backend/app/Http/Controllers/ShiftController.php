<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\ShiftCashMovement;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShiftController extends Controller
{
    public function current(Request $request)
    {
        $shift = Shift::with(['cashMovements.user', 'user'])
            ->where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();

        return response()->json(['status' => 'success', 'data' => $shift]);
    }

    public function open(Request $request)
    {
        $existing = Shift::where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();

        if ($existing) {
            return response()->json(['status' => 'error', 'message' => 'You already have an open shift'], 400);
        }

        $validated = $request->validate([
            'opening_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $shift = Shift::create([
            'user_id' => $request->user()->id,
            'opening_cash' => $validated['opening_cash'],
            'status' => 'open',
            'opened_at' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Shift opened', 'data' => $shift]);
    }

    public function close(Request $request, $id)
    {
        $shift = Shift::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        if ($shift->status === 'closed') {
            return response()->json(['status' => 'error', 'message' => 'Shift is already closed'], 400);
        }

        $validated = $request->validate([
            'closing_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Calculate total cash payments for this shift
        $cashSales = Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->where('payment_method', 'cash')
            ->sum('total_amount');

        $cashIns = ShiftCashMovement::where('shift_id', $shift->id)->where('type', 'in')->sum('amount');
        $cashOuts = ShiftCashMovement::where('shift_id', $shift->id)->where('type', 'out')->sum('amount');

        $expectedCash = $shift->opening_cash + $cashSales + $cashIns - $cashOuts;
        $variance = $validated['closing_cash'] - $expectedCash;

        $shift->update([
            'closing_cash' => $validated['closing_cash'],
            'expected_cash' => $expectedCash,
            'variance' => $variance,
            'status' => 'closed',
            'closed_at' => now(),
            'notes' => $validated['notes'] ?? $shift->notes,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Shift closed successfully',
            'data' => $shift->fresh(['user', 'cashMovements']),
        ]);
    }

    public function cashMovement(Request $request)
    {
        $shift = Shift::where('user_id', $request->user()->id)->where('status', 'open')->first();

        if (!$shift) {
            return response()->json(['status' => 'error', 'message' => 'No active open shift found'], 400);
        }

        $validated = $request->validate([
            'type' => 'required|in:in,out',
            'amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string|max:255',
        ]);

        $movement = ShiftCashMovement::create([
            'shift_id' => $shift->id,
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'reason' => $validated['reason'],
        ]);

        return response()->json(['status' => 'success', 'message' => 'Cash movement recorded', 'data' => $movement]);
    }

    public function history(Request $request)
    {
        $shifts = Shift::with(['user', 'cashMovements'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json(['status' => 'success', 'data' => $shifts]);
    }
}
