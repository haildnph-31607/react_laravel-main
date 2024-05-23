// import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../config/Api';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
  // Khởi tạo state cho các trường họ và tên, số điện thoại và địa chỉ giao hàng
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');



    useEffect(() => {
        // Gọi hàm để lấy carts của user khi component được render
        getCartsByUser();
        console.log(carts)
    }, []); // Dependency array rỗng đảm bảo hàm chỉ được gọi một lần khi component mount

    const userInfos = sessionStorage.getItem("userInfo");
    const auth_user = JSON.parse(userInfos);
  
    const getCartsByUser = async () => {
        try {
            const response = await axios.post(`${API_URL}/carts`, { user_id: auth_user[0].id });
            const cartsData = response.data;
            console.log("Carts:", cartsData);
            // Lưu dữ liệu carts vào state
            setCarts(cartsData);
            let totalCartPrice_temp = 0;

            // Lặp qua mảng cartsData để tính tổng tiền
            for (let i = 0; i < cartsData.length; i++) {
                // Lấy item hiện tại từ mảng cartsData
                const item = cartsData[i];
                // Tính tổng tiền của từng loại sản phẩm
                const itemTotal = item.quantity * +(item.price);
                // Cộng vào tổng tiền của giỏ hàng
                totalCartPrice_temp += itemTotal;
            }
            setTotalCartPrice(Math.floor(totalCartPrice_temp))
            // Chuyển hướng đến trang thanh toán sau khi đã lấy được carts
        } catch (error) {
            console.error("Error while fetching carts:", error);
        }
    };

      // Hàm xử lý sự kiện thay đổi giá trị của trường họ và tên
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
};

// Hàm xử lý sự kiện thay đổi giá trị của trường số điện thoại
const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
};

// Hàm xử lý sự kiện thay đổi giá trị của trường địa chỉ giao hàng
const handleAddressChange = (e) => {
    setAddress(e.target.value);
};
    const handleCheckout = async (e) => {
        e.preventDefault()
        try {
            // Thực hiện các thao tác cần thiết trước khi chuyển đến trang thanh toán
            // Ví dụ: Kiểm tra xem giỏ hàng có hàng hay không
    
            // Tạo payload chứa thông tin người dùng và đơn hàng
            const payload = {
                user_id: auth_user[0].id, // Lấy user_id từ context hoặc props
                full_name: fullName, // Lấy tên người dùng từ input
                phone_number: phoneNumber, // Lấy số điện thoại từ input
                address:address // Lấy địa chỉ từ input
                // Các thuộc tính khác nếu cần
            };
    
            // Gửi request POST đến API để thực hiện thanh toán
            const response = await axios.post(`${API_URL}/checkout`,  payload);
           
    
            // Kiểm tra kết quả từ server
            if (response.status === 200) {
                console.log(response.data);
                window.location.href = response.data.redirect_url;
                // await   Swal.fire({
                //     title: "Thanh toán thành công!",
                //     text: "Tiếp tục",
                //     icon: "success"
                //   });
                  
            } else {
                console.error('Checkout failed.');
                // Xử lý lỗi nếu có
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            // Xử lý lỗi nếu có
        }
    };
    return (
        <section>
            <div className="container">
                {/* <!-- HERO SECTION--> */}
                <section className="py-5 bg-light">
                <div className="container">
                    <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
                    <div className="col-lg-6">
                        <h1 className="h2 text-uppercase mb-0">Tiến hành đặt hàng</h1>
                    </div>
                    <div className="col-lg-6 text-lg-end">
                        <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-lg-end mb-0 px-0 bg-light">
                            <li className="breadcrumb-item"><Link className="text-dark" to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link className="text-dark" to="/gio-hang">Giỏ hàng</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Thanh toán</li>
                        </ol>
                        </nav>
                    </div>
                    </div>
                </div>
                </section>
                <section className="py-5">
                {/* <!-- BILLING ADDRESS--> */}
                <h2 className="h5 text-uppercase mb-4">Thông tin hóa đơn</h2>
                <div className="row">
                    <div className="col-lg-8">
                    <form action="#" onSubmit={handleCheckout}>
                        <div className="row gy-3">
                        <div className="col-lg-6">
                <label className="form-label text-sm text-uppercase" htmlFor="fullName">Họ và Tên </label>
                <input className="form-control form-control-lg" autoComplete='fullName' type="text" id="fullName" name='fullName' placeholder="Enter your last name" value={fullName} onChange={handleFullNameChange} />
            </div>
                        <div className="col-lg-6">
                            <label className="form-label text-sm text-uppercase" htmlFor="email">Địa chỉ Email </label>
                            <input className="form-control form-control-lg" autoComplete='email' type="email" id="email" name='email' placeholder="e.g. Jason@example.com" />
                        </div>
                        <div className="col-lg-6">
                <label className="form-label text-sm text-uppercase" htmlFor="phoneNumber">Số điện thoại </label>
                <input className="form-control form-control-lg" autoComplete='phoneNumber' type="tel" id="phoneNumber" name='phoneNumber' placeholder="e.g. +02 245354745" value={phoneNumber} onChange={handlePhoneNumberChange} />
            </div>
                        {/* <div className="col-lg-6">
                            <label className="form-label text-sm text-uppercase" htmlFor="company">Company name (optional) </label>
                            <input className="form-control form-control-lg" type="text" id="company" placeholder="Your company name">
                        </div> */}
                        <div className="col-lg-6">
                            <label className="form-label text-sm text-uppercase" htmlFor="city">Thành phố </label>
                            <input className="form-control form-control-lg" type="text" id="city" />
                        </div>
                        <div className="col-lg-12">
                <label className="form-label text-sm text-uppercase" htmlFor="address">Địa chỉ giao hàng </label>
                <input className="form-control form-control-lg" type="text" id="address" placeholder="Mời nhập chi tiết thông tin địa chỉ" value={address} onChange={handleAddressChange} />
            </div>
                        <div className="col-lg-12 form-group">
                        <button className="btn btn-dark" type="submit" >
            Tiến hành thanh toán
        </button>
                        </div>
                        </div>
                    </form>
                    </div>
                    {/* <!-- ORDER SUMMARY--> */}
                    <div className="col-lg-4">
                    <div className="card border-0 rounded-0 p-lg-4 bg-light">
                        <div className="card-body">
                        <h5 className="text-uppercase mb-4">Đơn hàng của bạn gồm <span>(5)</span></h5>
                        <ul className="list-unstyled mb-0">
    {/* Duyệt qua từng mục trong mảng carts */}
    {carts && carts.length > 0 && carts.map((cartItem, index) => (
        <li key={index} className="d-flex align-items-center justify-content-between">
            {/* Hiển thị tên sản phẩm và màu sắc biến thể */}
            <strong className="small fw-bold">{cartItem.product_name} - {cartItem.variation_color} x {cartItem.quantity} </strong>
            {/* Hiển thị giá sản phẩm */}
            <span className="text-muted small">${Math.floor(cartItem.quantity * parseFloat(cartItem.price))}</span>
        </li>
    ))}
    {/* Tạo đường gạch ngang */}
    <li className="border-bottom my-2"></li>
    {/* Hiển thị tổng tiền */}
    <li className="d-flex align-items-center justify-content-between">
        <strong className="text-uppercase small fw-bold">Total</strong>
        <span>${totalCartPrice}</span>
    </li>
</ul>

                        </div>
                    </div>
                    </div>
                </div>
                </section>
            </div>
        </section>
    );
};

export default Checkout;