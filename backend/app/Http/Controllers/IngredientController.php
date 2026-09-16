<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\ProductRecipe;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::orderBy('name')->get();
        return response()->json(['status' => 'success', 'data' => $ingredients]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name',
            'unit' => 'required|string|max:20',
            'current_stock' => 'required|numeric|min:0',
            'min_stock_alert' => 'required|numeric|min:0',
            'unit_cost' => 'required|numeric|min:0',
        ]);

        $ingredient = Ingredient::create($validated);
        return response()->json(['status' => 'success', 'message' => 'Ingredient created', 'data' => $ingredient], 201);
    }

    public function update(Request $request, $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:ingredients,name,' . $id,
            'unit' => 'sometimes|string|max:20',
            'current_stock' => 'sometimes|numeric|min:0',
            'min_stock_alert' => 'sometimes|numeric|min:0',
            'unit_cost' => 'sometimes|numeric|min:0',
        ]);

        $ingredient->update($validated);
        return response()->json(['status' => 'success', 'message' => 'Ingredient updated', 'data' => $ingredient]);
    }

    public function destroy($id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->delete();
        return response()->json(['status' => 'success', 'message' => 'Ingredient deleted']);
    }

    // Product Recipes
    public function getRecipes($productId)
    {
        $recipes = ProductRecipe::with('ingredient')
            ->where('product_id', $productId)
            ->get();

        return response()->json(['status' => 'success', 'data' => $recipes]);
    }

    public function saveRecipes(Request $request, $productId)
    {
        $validated = $request->validate([
            'recipes' => 'required|array',
            'recipes.*.ingredient_id' => 'required|exists:ingredients,id',
            'recipes.*.quantity_required' => 'required|numeric|gt:0',
        ]);

        ProductRecipe::where('product_id', $productId)->delete();

        foreach ($validated['recipes'] as $item) {
            ProductRecipe::create([
                'product_id' => $productId,
                'ingredient_id' => $item['ingredient_id'],
                'quantity_required' => $item['quantity_required'],
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'Product recipes saved']);
    }
}
