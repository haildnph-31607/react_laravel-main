<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = ['quantity', 'price', 'user_id', 'variant_id', 'product_id'];

}
