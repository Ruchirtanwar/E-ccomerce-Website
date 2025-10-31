import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {backendUrl,currency} from "../App"
const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.message);
      if (error.response && error.response.data.message === "Token invalid or expired") {
        navigate("/login");
      }
    }
  };

  const paymentStatusHandler = async (event, orderId) => {
    const paymentStatus = event.target.value; // Get the selected payment status
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/paymentstatus`,
        {
          orderId,
          payment: paymentStatus,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Payment status updated successfully");
        fetchAllOrders(); // Refresh the orders list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error(error.message);
      if (error.response && error.response.data.message === "Token invalid or expired") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      {orders.map((order) => (
        <div
          className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          key={order._id}
        >
          <div>
            <div>
              {Array.isArray(order.items) &&
                order.items.map((item, idx) => (
                  <p className="py-0.5" key={idx}>
                    {item.name} X {item.quantity} <span>{item.size}</span>
                  </p>
                ))}
            </div>
            <p className="mt-3 mb-2 font-medium">
              {order.address?.firstName || ""}{" "}
              {order.address?.lastName || ""}
            </p>
            <div>
              <p>{order.address?.street || ""}</p>
              <p>
                {(order.address?.city ? order.address.city + ", " : "") +
                  (order.address?.state ? order.address.state + ", " : "") +
                  (order.address?.country ? order.address.country + ", " : "") +
                  (order.address?.zipcode ? order.address.zipcode : "")}
              </p>
            </div>
            <p>{order.address?.phone || ""}</p>
          </div>

          <div>
            <p className="text:sm sm:text=[15px]">Items : {order.items?.length || 0}</p>
            <p className="mt-3">Method : {order.paymentMethod || "-"}</p>
            <p>Payment : {order.payment ? "Done" : "Pending"}</p>
            <p>
              Date:{" "}
              {new Date(order.Date || order.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <p className="text:sm sm:text-[15px]">
            {currency}
            {order.amount}
          </p>

          <select
            onChange={(event) => statusHandler(event, order._id)}
            className="p-2 font-semibold"
            value={order.status || "Order Placed"}
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          <div>
            <select
              onChange={(event) => paymentStatusHandler(event, order._id)}
              value={order.payment ? "Done" : "Pending"}
              className="p-2 font-semibold"
            >
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
