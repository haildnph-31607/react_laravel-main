<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\OrderItems;
use App\Models\Orders;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        // Lấy thông tin auth user id từ request
        $user_id = $request->user_id;

        // Lấy carts của user đó
        $carts = Cart::where('user_id', $user_id)->get();

        // Kiểm tra xem có carts không
        if ($carts->isEmpty()) {
            return response()->json(['error' => 'No items in the cart'], 400);
        }
        $totalAmount = 0;
        // Tạo mới đơn hàng (order)
        $order = new Orders();
        $order->user_id = $user_id;
        $order->order_number = uniqid() ;
        $order->full_name = $request->full_name;
        $order->phone_number = $request->phone_number;
        $order->address = $request->address;
        $order->date_create = now()->toDateString();
        $order->time_create = now()->toTimeString();
        // Lưu thông tin đơn hàng vào bảng orders
        $order->save();

        // Duyệt qua từng cart và tạo order item tương ứng
        foreach ($carts as $cart) {
            $totalAmount += $cart->quantity * $cart->price;
            $orderItem = new OrderItems();
            $orderItem->quantity = $cart->quantity;
            $orderItem->price = $cart->price;
            $orderItem->order_id = $order->id;
            $orderItem->product_id = $cart->product_id;
            $orderItem->variant_id = $cart->variant_id; // Nếu cần
            // Lưu thông tin order item vào bảng order_items
            $orderItem->save();
        }

        // Xóa tất cả carts của user đó sau khi checkout
        Cart::where('user_id', $user_id)->delete();



        // bank logic
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:5173/lazi-store/checkpayment";
        $vnp_TmnCode = "R3E63P5P"; //Mã website tại VNPAY
        $vnp_HashSecret = "GXDEHIEBSREFTEALNKYBXMKDKVVBEJPC"; //Chuỗi bí mật

        $vnp_TxnRef = $order->id; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
        $vnp_OrderInfo = 'Thanh Toán đơn hàng tại Shop';
        $vnp_OrderType = 'bank';
        $vnp_Amount = round((  $totalAmount ) * 100 * 24305) ;
        $vnp_Locale = 'vn';
        $vnp_BankCode = 'NCB';
        $vnp_IpAddr = 'http://localhost:5173/lazi-store/checkpayment';
        //Add Params of 2.0.1 Version
        // $vnp_ExpireDate = $_POST['txtexpire'];
        // //Billing
        // $vnp_Bill_Mobile = $_POST['txt_billing_mobile'];
        // $vnp_Bill_Email = $_POST['txt_billing_email'];
        // $fullName = trim($_POST['txt_billing_fullname']);
        // if (isset($fullName) && trim($fullName) != '') {
        //     $name = explode(' ', $fullName);
        //     $vnp_Bill_FirstName = array_shift($name);
        //     $vnp_Bill_LastName = array_pop($name);
        // }
        // $vnp_Bill_Address=$_POST['txt_inv_addr1'];
        // $vnp_Bill_City=$_POST['txt_bill_city'];
        // $vnp_Bill_Country=$_POST['txt_bill_country'];
        // $vnp_Bill_State=$_POST['txt_bill_state'];
        // // Invoice
        // $vnp_Inv_Phone=$_POST['txt_inv_mobile'];
        // $vnp_Inv_Email=$_POST['txt_inv_email'];
        // $vnp_Inv_Customer=$_POST['txt_inv_customer'];
        // $vnp_Inv_Address=$_POST['txt_inv_addr1'];
        // $vnp_Inv_Company=$_POST['txt_inv_company'];
        // $vnp_Inv_Taxcode=$_POST['txt_inv_taxcode'];
        // $vnp_Inv_Type=$_POST['cbo_inv_type'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            // "vnp_ExpireDate"=>$vnp_ExpireDate,
            // "vnp_Bill_Mobile"=>$vnp_Bill_Mobile,
            // "vnp_Bill_Email"=>$vnp_Bill_Email,
            // "vnp_Bill_FirstName"=>$vnp_Bill_FirstName,
            // "vnp_Bill_LastName"=>$vnp_Bill_LastName,
            // "vnp_Bill_Address"=>$vnp_Bill_Address,
            // "vnp_Bill_City"=>$vnp_Bill_City,
            // "vnp_Bill_Country"=>$vnp_Bill_Country,
            // "vnp_Inv_Phone"=>$vnp_Inv_Phone,
            // "vnp_Inv_Email"=>$vnp_Inv_Email,
            // "vnp_Inv_Customer"=>$vnp_Inv_Customer,
            // "vnp_Inv_Address"=>$vnp_Inv_Address,
            // "vnp_Inv_Company"=>$vnp_Inv_Company,
            // "vnp_Inv_Taxcode"=>$vnp_Inv_Taxcode,
            // "vnp_Inv_Type"=>$vnp_Inv_Type
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array(
            'code' => '00', 'message' => 'success', 'data' => $vnp_Url
        );
        if (true) {
            // after payment is completed
            return response()->json(['redirect_url' => $vnp_Url], 200);
            // header('Location: ' . $vnp_Url);
            die();
        } else {
            echo json_encode($returnData);
        }
        // end vnpay


        return response()->json(['message' => 'Checkout successfully'], 200);
    }

    public function checkpayment(Request $request)
    {
        // Lấy dữ liệu từ request
        $data = $request->all();
        $orderId = $data['orderId'];
        $status = $data['status'];

        try {
            // Tìm đơn hàng theo orderId
            $order = Orders::findOrFail($orderId);

            // Cập nhật trạng thái đơn hàng
            $order->status = $status;
            $order->save();

            // Trả về phản hồi thành công
            return response()->json(['message' => 'Order status updated successfully'], 200);
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json(['error' => 'Failed to update order status: ' . $e->getMessage()], 500);
        }
    }
}
