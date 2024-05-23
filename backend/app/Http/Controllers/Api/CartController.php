<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        // Kiểm tra request có chứa thông tin sản phẩm cần thêm vào giỏ hàng không
        if ($request->has('variant_id') && $request->has('product_id') && $request->has('quantity')) {
            $user_id = $request->user_id;

            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng của user không
            $existingCart = Cart::where('user_id', $user_id)
                                ->where('product_id', $request->product_id)
                                ->where('variant_id', $request->variant_id)
                                ->first();

            if ($existingCart) {
                // Nếu sản phẩm đã tồn tại, cộng thêm số lượng mới vào số lượng hiện tại của sản phẩm
                $existingCart->quantity += $request->quantity;
                $existingCart->save();
            } else {
                // Nếu sản phẩm chưa tồn tại, tạo mới một cart với thông tin sản phẩm và số lượng mới
                $cart = new Cart();
                $cart->variant_id = $request->variant_id;
                $cart->product_id = $request->product_id;
                $cart->quantity = $request->quantity;
                // Giả sử bạn đã lấy giá từ variant hoặc sản phẩm, gán vào price
                $cart->price = $request->price; // Cần điều chỉnh nếu cần thiết
                // Giả sử bạn có thông tin user từ authentication, gán user_id vào cart
                $cart->user_id = $user_id; // Cần điều chỉnh nếu cần thiết
                // Lưu cart vào cơ sở dữ liệu
                $cart->save();
            }

            // Trả về response thành công nếu thêm vào giỏ hàng thành công
            return response()->json(['message' => 'Added to cart successfully'], 200);
        }

        // Trả về response lỗi nếu request không hợp lệ
        return response()->json(['error' => 'Invalid request'], 400);
    }
    public function getCartsByUser(Request $request)
    {
        // Lấy user_id từ request (nếu cần)
        $user_id = $request->user_id;

        // Lấy danh sách các carts của user dựa trên user_id và join thông tin về sản phẩm
        $carts = Cart::where('user_id', $user_id)
        ->join('products', 'carts.product_id', '=', 'products.id')
        ->join('product_variations', 'carts.variant_id', '=', 'product_variations.id')
        ->select('carts.*', 'products.name as product_name', 'product_variations.color_type as variation_color')
        ->get();


        // Trả về danh sách carts
        return response()->json($carts);
    }
    public function deleteCart($id)
    {
        try {
            // Tìm kiếm cart theo id
            $cart = Cart::find($id);

            // Kiểm tra xem cart có tồn tại không
            if (!$cart) {
                // Nếu không tìm thấy, trả về lỗi 404 Not Found
                return response()->json(['error' => 'Cart not found'], 404);
            }

            // Xóa cart
            $cart->delete();

            // Trả về thông báo xóa thành công
            return response()->json(['message' => 'Cart deleted successfully'], 200);
        } catch (\Exception $e) {
            // Nếu có lỗi xảy ra, trả về thông báo lỗi
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateCart(Request $request, $id)
    {
        try {
            // Tìm kiếm cart theo id
            $cart = Cart::find($id);

            // Kiểm tra xem cart có tồn tại không
            if (!$cart) {
                // Nếu không tìm thấy, trả về lỗi 404 Not Found
                return response()->json(['error' => 'Cart not found'], 404);
            }

            // Cập nhật số lượng của cart
            $cart->quantity = $request->input('quantity');

            // Lưu thay đổi vào cơ sở dữ liệu
            $cart->save();

            // Trả về thông báo cập nhật thành công
            return response()->json(['message' => 'Cart updated successfully'], 200);
        } catch (\Exception $e) {
            // Nếu có lỗi xảy ra, trả về thông báo lỗi
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
