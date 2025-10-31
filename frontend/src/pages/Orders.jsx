import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ for modal data
  const [showModal, setShowModal] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrderItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.address = order.address; // ✅ include address info
            allOrderItem.push(item);
          });
        });
        setOrderData(allOrderItem);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // ✅ Open modal for selected order
  const openModal = (item) => {
    setSelectedOrder(item);
    setShowModal(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orderData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          🛍️ You have no orders yet.{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Start shopping!
          </span>
        </div>
      ) : (
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img src={item.image[0]} className="w-16 sm:w-20" alt="" />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>

                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-2">
                    Payment:{" "}
                    <span className="text-gray-400">
                      {item.paymentMethod?.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={() => openModal(item)} // ✅ open modal here
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100"
                >
                   Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ MODAL */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 sm:w-2/3 md:w-1/2 p-6 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Order Details
            </h2>

            {/* Product details */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedOrder.image[0]}
                alt={selectedOrder.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-lg">{selectedOrder.name}</p>
                <p className="text-gray-600 text-sm">
                  {currency}
                  {selectedOrder.price} × {selectedOrder.quantity}
                </p>
                <p className="text-gray-600 text-sm">Size: {selectedOrder.size}</p>
                <p className="text-gray-500 text-sm">
                  Ordered on {new Date(selectedOrder.date).toDateString()}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">💳 Payment Information</h3>
              <p>
                Method:{" "}
                <span className="text-gray-600">
                  {selectedOrder.paymentMethod?.toUpperCase()}
                </span>
              </p>
              <p>
                Status:{" "}
                <span className="text-gray-600">
                  {selectedOrder.payment || "Pending"}
                </span>
              </p>
              <p>
                Total Amount:{" "}
                <span className="text-gray-600">
                  {currency}
                  {selectedOrder.price * selectedOrder.quantity}
                </span>
              </p>
            </div>

            {/* Delivery Info */}
            {selectedOrder.address && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">📦 Delivery Information</h3>
                <p>
                  {selectedOrder.address.firstName}{" "}
                  {selectedOrder.address.lastName}
                </p>
                <p>{selectedOrder.address.street}</p>
                <p>
                  {selectedOrder.address.city}, {selectedOrder.address.state} -{" "}
                  {selectedOrder.address.zipcode}
                </p>
                <p>{selectedOrder.address.country}</p>
                <p>Phone: {selectedOrder.address.phone}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
