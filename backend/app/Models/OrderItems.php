<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = [
        'quantity',
        'price',
        'order_id',
        'product_id',
        'variant_id',
    ];
}
