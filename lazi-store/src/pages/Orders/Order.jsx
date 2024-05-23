import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/Api';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfos = sessionStorage.getItem('userInfo');
        const auth_user = JSON.parse(userInfos);
        const response = await axios.post(`${API_URL}/order`, {
          user_id: auth_user[0].id,
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200';
      case 'unpaid':
        return 'bg-red-200';
      case 'paid':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order Number</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Date Created</th>
              <th className="border border-gray-300 px-4 py-2">Time Created</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border border-gray-300 px-4 py-2">{order.order_number}</td>
                <td className="border border-gray-300 px-4 py-2">{order.full_name}</td>
                <td className="border border-gray-300 px-4 py-2">{order.phone_number}</td>
                <td className="border border-gray-300 px-4 py-2">{order.address}</td>
                <td className="border border-gray-300 px-4 py-2">{order.date_create}</td>
                <td className="border border-gray-300 px-4 py-2">{order.time_create}</td>
                <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(order.status)}`}>
                  {order.status === 'pending' && 'Đang chờ xác nhận'}
                  {order.status === 'unpaid' && 'Chưa thanh toán'}
                  {order.status === 'paid' && 'Đã thanh toán'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;
