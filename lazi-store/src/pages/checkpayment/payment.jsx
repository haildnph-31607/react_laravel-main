import axios from "axios";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL from "../../config/Api";
 

function CheckPayment() {
  const fontSize = {
    fontSize: '56px',
  };

  const fontSizeMediaQuery = {
    '@media (min-width: 768px)': {
      fontSize: '260px',
    },
  };
  const queryParameters = new URLSearchParams(window.location.search)
  
  let vnp_ResponseCode =  queryParameters.get('vnp_ResponseCode')
  let vnp_TxnRef =  queryParameters.get('vnp_TxnRef')
  useEffect(() => {
    // Kiểm tra xem mã phản hồi của VNPay có phải là 00 không (thanh toán thành công)
    if (vnp_ResponseCode === '00') {
      // Gọi API để cập nhật trạng thái của đơn hàng thành 'paid'
      axios.post(`${API_URL}/checkpayment`, { status: 'paid', orderId: vnp_TxnRef })
        .then(response => {
          // Xử lý phản hồi từ API nếu cần
          console.log('Payment status updated successfully:', response.data);
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Error updating payment status:', error);
        });
    }else {
        axios.post(`${API_URL}/checkpayment`, { status: 'unpaid', orderId: vnp_TxnRef })
        .then(response => {
          // Xử lý phản hồi từ API nếu cần
          console.log('Payment status updated successfully:', response.data);
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Error updating payment status:', error);
        }); 
    }
  }, [vnp_TxnRef, vnp_ResponseCode]); // useEffect sẽ chạy lại khi các giá trị vnp_TxnRef hoặc vnp_ResponseCode thay đổi


  // Kiểm tra vnp_ResponseCode để xác định trạng thái thanh toán
  const paymentSuccess = vnp_ResponseCode == '00';
  return (
    <>
      <div className="h-100 w-100 text-center">
        <h3 style={{ height: 500 }}>
          <p>
            <Link className="text-decoration-underline fs-4" to={"/"}>
              Trở lại trang chủ
            </Link>
          </p>
          {paymentSuccess ? (
            <p className="text-success" style={{ ...fontSize, ...fontSizeMediaQuery }}>
              <div className={`fixed inset-0 flex items-center justify-center z-50 ${'pointer-events-none'}`}>
               
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Payment Successful!</h2>
                  <p className="text-gray-700 mb-4">
                    Thank you for your payment. Your transaction has been completed successfully.
                  </p>
                </div>
              </div>
            </p>
          ) : (
            <p className="text-danger" style={{ ...fontSize, ...fontSizeMediaQuery }}>
              <div className={`fixed inset-0 flex items-center justify-center z-50 ${'pointer-events-none'}`}>
              
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Payment Failed!</h2>
                  <p className="text-gray-700 mb-4">Payment unsuccessful. Please try again.</p>
                </div>
              </div>
            </p>
          )}
        </h3>
      </div>
    </>
  );
}

export default CheckPayment;
