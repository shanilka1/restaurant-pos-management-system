<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'loyalty_points')) {
                $table->integer('loyalty_points')->default(0)->after('address');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'order_type')) {
                $table->enum('order_type', ['dine_in', 'takeaway', 'delivery'])->default('dine_in')->after('customer_id');
            }
            if (!Schema::hasColumn('orders', 'table_id')) {
                $table->foreignId('table_id')->nullable()->after('order_type')->constrained('restaurant_tables')->onDelete('set null');
            }
            if (!Schema::hasColumn('orders', 'subtotal')) {
                $table->decimal('subtotal', 10, 2)->default(0.00)->after('table_id');
            }
            if (!Schema::hasColumn('orders', 'tax_amount')) {
                $table->decimal('tax_amount', 10, 2)->default(0.00)->after('subtotal');
            }
            if (!Schema::hasColumn('orders', 'service_charge')) {
                $table->decimal('service_charge', 10, 2)->default(0.00)->after('tax_amount');
            }
            if (!Schema::hasColumn('orders', 'discount_amount')) {
                $table->decimal('discount_amount', 10, 2)->default(0.00)->after('service_charge');
            }
            if (!Schema::hasColumn('orders', 'tip_amount')) {
                $table->decimal('tip_amount', 10, 2)->default(0.00)->after('discount_amount');
            }
            if (!Schema::hasColumn('orders', 'kitchen_status')) {
                $table->enum('kitchen_status', ['pending', 'in_kitchen', 'ready', 'served'])->default('pending')->after('status');
            }
            if (!Schema::hasColumn('orders', 'shift_id')) {
                $table->foreignId('shift_id')->nullable()->after('kitchen_status')->constrained('shifts')->onDelete('set null');
            }
            if (!Schema::hasColumn('orders', 'paid_amount')) {
                $table->decimal('paid_amount', 10, 2)->default(0.00)->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'change_amount')) {
                $table->decimal('change_amount', 10, 2)->default(0.00)->after('paid_amount');
            }
            if (!Schema::hasColumn('orders', 'split_payments')) {
                $table->json('split_payments')->nullable()->after('change_amount');
            }
            if (!Schema::hasColumn('orders', 'notes')) {
                $table->text('notes')->nullable()->after('split_payments');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'modifiers')) {
                $table->json('modifiers')->nullable()->after('unit_price');
            }
            if (!Schema::hasColumn('order_items', 'notes')) {
                $table->string('notes')->nullable()->after('modifiers');
            }
            if (!Schema::hasColumn('order_items', 'item_status')) {
                $table->enum('item_status', ['pending', 'in_kitchen', 'ready', 'served'])->default('pending')->after('notes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['modifiers', 'notes', 'item_status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['table_id']);
            $table->dropForeign(['shift_id']);
            $table->dropColumn([
                'order_type', 'table_id', 'subtotal', 'tax_amount', 'service_charge',
                'discount_amount', 'tip_amount', 'kitchen_status', 'shift_id',
                'paid_amount', 'change_amount', 'split_payments', 'notes'
            ]);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['loyalty_points']);
        });
    }
};
