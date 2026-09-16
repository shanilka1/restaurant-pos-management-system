<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'unit',
        'current_stock',
        'min_stock_alert',
        'unit_cost',
    ];

    public function recipes()
    {
        return $this->hasMany(ProductRecipe::class);
    }
}
