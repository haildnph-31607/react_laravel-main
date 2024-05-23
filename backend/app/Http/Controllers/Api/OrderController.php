<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderItems;
use App\Models\Orders;

class OrderController extends Controller
{
    public function getAllOrder(Request $request)
    {
        try {
            // Lấy ID người dùng từ request
            $userId = $request->user_id;

            // Lấy tất cả các đơn hàng của người dùng
            $orders = Orders::where('user_id', $userId)->get();

            // Duyệt qua từng đơn hàng để kèm thông tin của các mục đặt hàng
            foreach ($orders as $order) {
                $orderItems = OrderItems::where('order_id', $order->id)->get();
                $order->items = $orderItems;
            }

            // Trả về danh sách đơn hàng với thông tin của các mục đặt hàng
            return response()->json(['orders' => $orders], 200);
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json(['error' => 'Failed to fetch orders: ' . $e->getMessage()], 500);
        }
    }
}
