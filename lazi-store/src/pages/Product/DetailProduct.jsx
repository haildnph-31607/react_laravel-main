import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { useDispatch } from "react-redux";
import cartSlice from "../../state/cartSlice";
import API_URL from "../../config/Api";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const DetailProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    //user data 
  const userInfos = sessionStorage.getItem("userInfo");

    const auth_user =     JSON.parse(userInfos);
    // const type = useParams()['type'];
    const path = 'https://vietbh.github.io/lazi-store/';
    const [products,setProducts] = useState([]);
    const [productDetail,setProductDetail] = useState([]);

    const [color,setColor] = useState('');
    const dispatch = useDispatch();
    const {add} = cartSlice.actions
    // detail
    const [selectedColor, setSelectedColor] = useState('');
    const [minPrice, setMinPrice] = useState(Number.MAX_VALUE);
    const [maxPrice, setMaxPrice] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // add to cart
    const [quantity, setQuantity] = useState(0);
    
    const handleColorClick = (colorType, variant ) => {
        setSelectedColor(colorType);
        setSelectedProduct(variant)
        setQuantity(1)
    };
    const getDetail = async (id) => {
        try {
          const response = await axios.get(`${API_URL}/san-pham/${id}`);
          const data = response.data;
          setProductDetail(data)
        } catch (error) {
          console.log(error);
          return null;
        }
      };


      const addToCart = async () => {
        try {
            if (!selectedProduct) {
                // Nếu không có sản phẩm nào được chọn
                console.log('Please select a product variant.');
                return;
            }
            const price = selectedProduct.price_sale !== "0.00" ? selectedProduct.price_sale : selectedProduct.price;
            // Tạo payload để gửi lên server
            const payload = {
                quantity: parseInt(quantity),
                product_id: selectedProduct.product_id,
                variant_id: selectedProduct.id,
                price: parseFloat(price), // Chuyển đổi sang kiểu số thực
                user_id: auth_user[0].id // Sử dụng auth_user từ context hoặc props
            };
            console.log(payload)
            // Gửi request POST lên server
            const response = await axios.post(`${API_URL}/add-to-cart`, payload);
    
            // Kiểm tra kết quả từ server
            if (response.status === 200) {
                console.log('Product added to cart successfully!');
                // Reset quantity sau khi thêm vào giỏ hàng
                setQuantity(0);
             await   Swal.fire({
                    title: "Good job!",
                    text: "You clicked the button!",
                    icon: "success"
                  });
                navigate('/lazi-store/gio-hang.html');
            } else {
                console.log('Failed to add product to cart.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };
    

      useEffect(() => {
        // Tính toán giá thấp nhất và cao nhất từ các variant
        let min = Number.MAX_VALUE;
        let max = 0;
        productDetail && productDetail.variations && productDetail.variations.forEach(variation => {
            if (parseInt(variation.price) < min) min = parseInt(variation.price);
            if (parseInt(variation.price) > max) max = parseInt(variation.price);
        });
        setMinPrice(min);
        setMaxPrice(max);
    }, [productDetail]);
    
    useEffect(()=>{
        if (!productDetail.length) {
            getDetail(id);
        }
        const cachedProducts = JSON.parse(sessionStorage.getItem('products'));
        if(cachedProducts){
            setProducts(cachedProducts);
        }
    },[]);   
    

    return (
        <section className="py-5">
            <div className="container" >
                <div className="row mb-5">
                    <div className="col-lg-7">
                    {/* <!-- PRODUCT SLIDER--> */}
                        <div className="row m-sm-0">
                        <div className="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0 px-xl-2">
    <div className="swiper product-slider-thumbs">
        <div className="swiper-wrapper d-inline">
            {productDetail && productDetail.variations && productDetail.variations.map((variation, index) => (
                <div key={index} className="swiper-slide h-auto swiper-thumb-item mb-3">
                    <img className="w-100" src={variation.image_url} alt={`Product variation ${index + 1}`} />
                </div>
            ))}
        </div>
    </div>
</div>
<div className="col-sm-10 order-1 order-sm-2">
    <div className="swiper product-slider">
        <div className="swiper-wrapper">
            {productDetail && productDetail.variations && productDetail.variations.map((variation, index) => (
                <div key={index} className="swiper-slide h-auto">
                    <a className="glightbox product-view" href={variation.image_url} data-gallery="gallery2" data-glightbox={`Product item ${index + 1}`}>
                        <img className="img-fluid" src={variation.image_url} alt={`Product variation ${index + 1}`} />
                    </a>
                </div>
            ))}
        </div>
    </div>
</div>

                        </div>
                    </div>
                    <div className="col-lg-5">
    {/* <!-- PRODUCT DETAILS--> */}
{productDetail && productDetail.category?.name && (
    <div className="product-detail">
        <h1 className="text-2xl font-bold mb-4">{productDetail.name}</h1>
        <p className="mb-2"><strong>Category:</strong> {productDetail.category.name}</p>
        <p className="mb-4"><strong>Description:</strong> {productDetail.description}</p>
        <h3 className="text-lg font-semibold mb-2">Variations:</h3>
        <div className="variation-buttons mb-4">
            {productDetail.variations.map(variation => (
                <button 
                    key={variation.id} 
                    onClick={() => handleColorClick(variation.color_type, variation)}
                    className={`color-button ${selectedColor === variation.color_type ? 'selected' : ''} mr-2 mb-2 py-1 px-4 border border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200`}
                >
                    {variation.color_type}
                </button>
            ))}
        </div>
        <h3 className="text-lg font-semibold mb-2">Price:</h3>
        <div className="price">
            {selectedColor ? (
                `$${productDetail.variations.find(variation => variation.color_type === selectedColor)?.price}`
            ) : (
                `From $${minPrice} - $${maxPrice}`
            )}
        </div>
        {/* Add to Cart button and Quantity input */}
        <div className="flex items-center mt-4">
        <input 
    type="number" 
    className="w-50 mr-4 border border-gray-300 rounded-md p-1 focus:outline-none focus:border-blue-500"
    value={quantity} 
    min={1}
    onChange={(e) => setQuantity(e.target.value)} 
    max={selectedProduct ? selectedProduct.quantity : 0} // Set max quantity based on selected product
/>
<button 
    className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
    onClick={addToCart}
>
    Add to Cart
</button>

        </div>
    </div>
)}

                    </div>
              
                </div>
                {/* <!-- DETAILS TABS--> */}
                <div className="row mb-5">
                    <div className="col-lg-7 col-sm-12">
                        <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
                            <li className="nav-item"><a className="nav-link text-uppercase active" id="description-tab" data-bs-toggle="tab" href="#description" role="tab" aria-controls="description" aria-selected="true">Thông tin</a></li>
                            <li className="nav-item"><a className="nav-link text-uppercase" id="reviews-tab" data-bs-toggle="tab" href="#reviews" role="tab" aria-controls="reviews" aria-selected="false">Đánh giá</a></li>
                        </ul>
                        <div className="tab-content mb-5" id="myTabContent">
                            <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                                <div className="p-4 p-lg-12 bg-white">
                                    <h6 className="fs-4 mb-4">Thông tin về sản phẩm này</h6>
                                    <p className="text-muted text-sm mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                                <div className="p-4 p-lg-5 bg-white">
                                    <div className="row">
                                    <div className="col-lg-12">
                                        <div className="d-flex mb-5">
                                            <div className="flex-shrink-0"><img className="rounded-circle" src={`${path}img/customer-1.png`} alt="" width="50"/></div>
                                            <div className="ms-3 flex-shrink-1">
                                                <h6 className="mb-0 text-uppercase">Jason Doe</h6>
                                                <p className="small text-muted mb-0 text-uppercase">20 May 2020</p>
                                                <p className="text-sm mb-0 text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="flex-shrink-0"><img className="rounded-circle" src={`${path}img/customer-2.png`} alt="" width="50"/></div>
                                            <div className="ms-3 flex-shrink-1">
                                                <h6 className="mb-0 text-uppercase">Jane Doe</h6>
                                                <p className="small text-muted mb-0 text-uppercase">20 May 2020</p>
                                                <p className="text-sm mb-0 text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 col-sm-12">
                        <h3>Tin tức liên quan đến sản phẩm</h3>
                    </div>
                </div>
                {/* <!-- RELATED PRODUCTS--> */}
                <h2 className="h5 text-uppercase mb-4">Related products</h2>
                <div className="row">
                    {/* <!-- PRODUCT--> */}
                    <div className="col-lg-3 col-sm-6">
                    <div className="product text-center skel-loader">
                        <div className="d-block mb-3 position-relative"><a className="d-block" href="detail.html"><img className="img-fluid w-100" src={`${path}img/product-1.jpg`} alt="..." /></a>
                        <div className="product-overlay">
                            <ul className="mb-0 list-inline">
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-outline-dark" href="#!"><i className="far fa-heart"></i></a></li>
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-dark" href="#!">Add to cart</a></li>
                            <li className="list-inline-item mr-0"><a className="btn btn-sm btn-outline-dark" href="#productView" data-bs-toggle="modal"><i className="fas fa-expand"></i></a></li>
                            </ul>
                        </div>
                        </div>
                        <h6> <a className="reset-anchor" href="detail.html">Kui Ye Chen’s AirPods</a></h6>
                        <p className="small text-muted">$250</p>
                    </div>
                    </div>
                    {/* <!-- PRODUCT--> */}
                    <div className="col-lg-3 col-sm-6">
                    <div className="product text-center skel-loader">
                        <div className="d-block mb-3 position-relative"><a className="d-block" href="detail.html"><img className="img-fluid w-100" src={`${path}img/product-2.jpg`} alt="..." /></a>
                        <div className="product-overlay">
                            <ul className="mb-0 list-inline">
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-outline-dark" href="#!"><i className="far fa-heart"></i></a></li>
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-dark" href="#!">Add to cart</a></li>
                            <li className="list-inline-item mr-0"><a className="btn btn-sm btn-outline-dark" href="#productView" data-bs-toggle="modal"><i className="fas fa-expand"></i></a></li>
                            </ul>
                        </div>
                        </div>
                        <h6> <a className="reset-anchor" href="detail.html">Air Jordan 12 gym red</a></h6>
                        <p className="small text-muted">$300</p>
                    </div>
                    </div>
                    {/* <!-- PRODUCT--> */}
                    <div className="col-lg-3 col-sm-6">
                    <div className="product text-center skel-loader">
                        <div className="d-block mb-3 position-relative"><a className="d-block" href="detail.html"><img className="img-fluid w-100" src={`${path}img/product-3.jpg`} alt="..." /></a>
                        <div className="product-overlay">
                            <ul className="mb-0 list-inline">
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-outline-dark" href="#!"><i className="far fa-heart"></i></a></li>
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-dark" href="#!">Add to cart</a></li>
                            <li className="list-inline-item mr-0"><a className="btn btn-sm btn-outline-dark" href="#productView" data-bs-toggle="modal"><i className="fas fa-expand"></i></a></li>
                            </ul>
                        </div>
                        </div>
                        <h6> <a className="reset-anchor" href="detail.html">Cyan cotton t-shirt</a></h6>
                        <p className="small text-muted">$25</p>
                    </div>
                    </div>
                    {/* <!-- PRODUCT--> */}
                    <div className="col-lg-3 col-sm-6">
                    <div className="product text-center skel-loader">
                        <div className="d-block mb-3 position-relative"><a className="d-block" href="detail.html"><img className="img-fluid w-100" src={`${path}img/product-4.jpg`} alt="..." /></a>
                        <div className="product-overlay">
                            <ul className="mb-0 list-inline">
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-outline-dark" href="#!"><i className="far fa-heart"></i></a></li>
                            <li className="list-inline-item m-0 p-0"><a className="btn btn-sm btn-dark" href="#!">Add to cart</a></li>
                            <li className="list-inline-item mr-0"><a className="btn btn-sm btn-outline-dark" href="#productView" data-bs-toggle="modal"><i className="fas fa-expand"></i></a></li>
                            </ul>
                        </div>
                        </div>
                        <h6> <a className="reset-anchor" href="detail.html">Timex Unisex Originals</a></h6>
                        <p className="small text-muted">$351</p>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailProduct;