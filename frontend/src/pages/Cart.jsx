import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    getCartAmount,
    token,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
      
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems,products]);
  const handleProceed = () => {
    if (!token) {
      // 🔒 If user not logged in
      toast.warning("Please log in to proceed with payment.");
      navigate("/login"); // or open a modal/login page
      return;
    }

    if (getCartAmount() === 0) {
      toast.error("Please add a product to proceed.");
      return;
    }

    navigate("/place-order");
  };
  return (
    <div className="border-t pt-14">
      {/* Title */}
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      
      {/* details of the product */}
      <div>
      {cartData.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          🛒 Your cart is feeling lonely — add something you love ❤️
        </div>
      ) : (
        cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 "
            >
              {/* <div className="flex items-start gap-6">
                <img src={productData.image[0]} alt="" />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 bg-slate-50 border">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div> */}
              {/* imporved css version of above commented code */}
              <div className="flex items-center gap-4 sm:gap-6">
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover border rounded-md"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-sm sm:text-lg font-medium text-gray-800">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-3 sm:gap-5 mt-2">
                    <p className="text-sm sm:text-base text-gray-700">
                      {currency}
                      {productData.price}
                    </p>
                    <span className="text-xs sm:text-sm bg-gray-100 border rounded px-2 py-1">
                      Size: {item.size}
                    </span>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                type="number"
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                alt=""
              />
            </div>
          );
        })
      )
      }
      </div>
       {/* Proceed Button (only show when cart not empty) */}
    {cartData.length > 0 && (
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              // onClick={() => {
              //   // navigate('/place-order')
              //   if (getCartAmount() === 0) {
              //     toast.error("Please add a product to proceed");
              //   } else {
              //     navigate("/place-order");
              //   }
              // }}
                onClick={handleProceed}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Cart;
