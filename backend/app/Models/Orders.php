<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = [
        'order_number',
        'full_name',
        'phone_number',
        'address',
        'status',
        'user_id',
        'date_create',
        'time_create',
    ];
}
