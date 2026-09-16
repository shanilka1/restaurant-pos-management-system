<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Customer;
use App\Models\RestaurantTable;
use App\Models\Ingredient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@pos.com'],
            [
                'name' => 'Admin Manager',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $cashier = User::firstOrCreate(
            ['email' => 'cashier@pos.com'],
            [
                'name' => 'Cashier Staff',
                'password' => Hash::make('password'),
                'role' => 'cashier',
            ]
        );

        // Restaurant Tables
        $tables = [
            ['table_number' => 'T-01', 'section' => 'main', 'capacity' => 4, 'status' => 'available'],
            ['table_number' => 'T-02', 'section' => 'main', 'capacity' => 2, 'status' => 'available'],
            ['table_number' => 'T-03', 'section' => 'main', 'capacity' => 6, 'status' => 'available'],
            ['table_number' => 'OUT-01', 'section' => 'outdoor', 'capacity' => 4, 'status' => 'available'],
            ['table_number' => 'OUT-02', 'section' => 'outdoor', 'capacity' => 4, 'status' => 'available'],
            ['table_number' => 'VIP-01', 'section' => 'vip', 'capacity' => 8, 'status' => 'available'],
            ['table_number' => 'BAR-01', 'section' => 'bar', 'capacity' => 2, 'status' => 'available'],
        ];
        foreach ($tables as $t) {
            RestaurantTable::firstOrCreate(['table_number' => $t['table_number']], $t);
        }

        // Raw Ingredients
        $ingredients = [
            ['name' => 'Burger Bun', 'unit' => 'pcs', 'current_stock' => 150, 'min_stock_alert' => 30, 'unit_cost' => 0.40],
            ['name' => 'Beef Patty', 'unit' => 'pcs', 'current_stock' => 100, 'min_stock_alert' => 20, 'unit_cost' => 1.80],
            ['name' => 'Cheddar Cheese Slice', 'unit' => 'pcs', 'current_stock' => 200, 'min_stock_alert' => 50, 'unit_cost' => 0.30],
            ['name' => 'Pizza Dough', 'unit' => 'kg', 'current_stock' => 25, 'min_stock_alert' => 5, 'unit_cost' => 2.50],
            ['name' => 'Coffee Beans', 'unit' => 'kg', 'current_stock' => 15, 'min_stock_alert' => 3, 'unit_cost' => 12.00],
        ];
        foreach ($ingredients as $ing) {
            Ingredient::firstOrCreate(['name' => $ing['name']], $ing);
        }

        // Categories
        $cat1 = Category::firstOrCreate(['name' => 'Burgers'], ['description' => 'Gourmet burgers and sliders']);
        $cat2 = Category::firstOrCreate(['name' => 'Pizzas'], ['description' => 'Wood-fired oven artisan pizzas']);
        $cat3 = Category::firstOrCreate(['name' => 'Beverages'], ['description' => 'Cold drinks, juices & coffee']);
        $cat4 = Category::firstOrCreate(['name' => 'Desserts'], ['description' => 'Sweet treats and ice creams']);

        // Products
        $products = [
            ['category_id' => $cat1->id, 'sku' => 'BUR001', 'name' => 'Classic Cheeseburger', 'description' => 'Beef patty with melted cheddar, lettuce & tomato', 'price' => 8.99, 'stock_quantity' => 100],
            ['category_id' => $cat1->id, 'sku' => 'BUR002', 'name' => 'Double Bacon Burger', 'description' => 'Double beef patty, crispy bacon & smoked BBQ sauce', 'price' => 12.50, 'stock_quantity' => 80],
            ['category_id' => $cat2->id, 'sku' => 'PIZ001', 'name' => 'Margherita Pizza 12"', 'description' => 'Fresh mozzarella, basil & tomato sauce', 'price' => 14.00, 'stock_quantity' => 50],
            ['category_id' => $cat2->id, 'sku' => 'PIZ002', 'name' => 'Pepperoni Feast 12"', 'description' => 'Double pepperoni with mozzarella blend', 'price' => 16.99, 'stock_quantity' => 45],
            ['category_id' => $cat3->id, 'sku' => 'DRK001', 'name' => 'Iced Americano', 'description' => 'Freshly pulled espresso over ice', 'price' => 3.99, 'stock_quantity' => 200],
            ['category_id' => $cat3->id, 'sku' => 'DRK002', 'name' => 'Fresh Mango Smoothie', 'description' => 'Blended organic mangoes with yogurt', 'price' => 5.50, 'stock_quantity' => 120],
            ['category_id' => $cat4->id, 'sku' => 'DES001', 'name' => 'Chocolate Lava Cake', 'description' => 'Warm molten chocolate cake with vanilla ice cream', 'price' => 6.99, 'stock_quantity' => 60],
        ];
        foreach ($products as $p) {
            Product::firstOrCreate(['sku' => $p['sku']], $p);
        }

        // Customers
        Customer::firstOrCreate(
            ['email' => 'john.doe@example.com'],
            ['name' => 'John Doe', 'phone' => '+1234567890', 'address' => '123 Main St', 'loyalty_points' => 120]
        );
        Customer::firstOrCreate(
            ['email' => 'sarah.smith@example.com'],
            ['name' => 'Sarah Smith', 'phone' => '+1987654321', 'address' => '456 Elm St', 'loyalty_points' => 45]
        );
    }
}
