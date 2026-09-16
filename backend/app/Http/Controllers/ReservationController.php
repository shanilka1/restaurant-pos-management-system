<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['customer', 'table']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('reservation_time', $request->date);
        }

        $reservations = $query->orderBy('reservation_time', 'asc')->get();
        return response()->json(['status' => 'success', 'data' => $reservations]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'nullable|string|max:50',
            'customer_id' => 'nullable|exists:customers,id',
            'table_id' => 'nullable|exists:restaurant_tables,id',
            'party_size' => 'required|integer|min:1',
            'reservation_time' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $reservation = Reservation::create($validated);

        if ($reservation->table_id && $validated['reservation_time']) {
            // Update table status to reserved if reservation is today
            $resDate = date('Y-m-d', strtotime($validated['reservation_time']));
            if ($resDate === date('Y-m-d')) {
                RestaurantTable::where('id', $reservation->table_id)->update(['status' => 'reserved']);
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Reservation created', 'data' => $reservation], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,seated,cancelled,completed',
        ]);

        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $validated['status']]);

        if ($reservation->table_id) {
            if ($validated['status'] === 'seated') {
                RestaurantTable::where('id', $reservation->table_id)->update(['status' => 'occupied']);
            } else if (in_array($validated['status'], ['cancelled', 'completed'])) {
                RestaurantTable::where('id', $reservation->table_id)->update(['status' => 'available']);
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Reservation status updated', 'data' => $reservation]);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        return response()->json(['status' => 'success', 'message' => 'Reservation deleted']);
    }
}
