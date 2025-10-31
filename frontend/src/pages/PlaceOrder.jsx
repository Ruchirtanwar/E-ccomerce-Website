import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {navigate,backendUrl,token,cartItems,setCartItems, products,getCartAmount,delivery_fee} = useContext(ShopContext);
  const [formData,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:'',
  })
  const onChangehandler =(e)=>{
    const name= e.target.name
    const value= e.target.value
  setFormData(data => ({ ...data, [name]: value }));

  }
//   const onChangehandler = (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({ ...prev, [name]: value }));
// };
const initPay = (order)=>{
  const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,

    amount:order.amount,
    currency: order.currency,
    name:'Order Payment',
    description: 'Order Payment',
    order_id: order.id,
    receipt:order.receipt,
    handler: async (response)=>{
     
      try {
        const {data} = await axios.post(backendUrl+ '/api/order/verifyRazorpay', response,{headers:{token}}) 
     if (data.success) {
     navigate('/orders')
     setCartItems({}) 
     }
     
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

  // const onSubmithandler = async (e)=>{
  //   e.preventDefault()
  //   try {
  //     let orderItems = []

  //     // build order items correctly from cartItems
  //     for (const productId in cartItems) {
  //       const sizes = cartItems[productId];
  //       if (!sizes || typeof sizes !== "object") continue;
  //       for (const size in sizes) {
  //         const qty = sizes[size];
  //         if (!qty || qty <= 0) continue;
  //         const itemInfo = structuredClone(products.find((product) => product._id === productId));
  //         if (itemInfo) {
  //           itemInfo.size = size;
  //           itemInfo.quantity = qty;
  //           orderItems.push(itemInfo);
  //         }
  //       }
  //     }

  //     if (orderItems.length === 0) {
  //       toast.error("Cart is empty");
  //       return;
  //     }

  //     let orderData = {
  //       address: formData,
  //       items: orderItems,
  //       amount: getCartAmount() + delivery_fee,
  //       paymentMethod: method
  //     }

  //     switch (method) {
  //       case "cod": {
  //         const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } });
  //         if (response.data.success) {
  //           setCartItems({});
  //           navigate("/orders");
  //         } else {
  //           toast.error(response.data?.message || "Something went wrong");
  //         }
  //         break;
  //       }
  //       case "stripe": {
  //         const responseStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, { headers: { token } });
  //         if (responseStripe.data.success) {
  //           const { session_url } = responseStripe.data;
  //           window.location.replace(session_url);
  //         } else {
  //           toast.error(responseStripe.data?.message || "Something went wrong");
  //         }
  //         break;
  //       }
  //       case "razorpay": {
  //         const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, { headers: { token } });
  //         if (responseRazorpay.data.success) {
  //           initPay(responseRazorpay.data.order);
  //         } else {
  //           toast.error(responseRazorpay.data?.message || "Something went wrong");
  //         }
  //         break;
  //       }
  //       default:
  //         toast.error("Invalid payment method");
  //         break;
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     toast.error(error.response?.data?.message || error.message || "Something went wrong from catch")
  //   }
  // }
  //updated onsubmit handler having an alert of order placed successfully
  const onSubmithandler = async (e) => {
  e.preventDefault();
  try {
    let orderItems = [];

    // build order items correctly from cartItems
    for (const productId in cartItems) {
      const sizes = cartItems[productId];
      if (!sizes || typeof sizes !== "object") continue;
      for (const size in sizes) {
        const qty = sizes[size];
        if (!qty || qty <= 0) continue;
        const itemInfo = structuredClone(
          products.find((product) => product._id === productId)
        );
        if (itemInfo) {
          itemInfo.size = size;
          itemInfo.quantity = qty;
          orderItems.push(itemInfo);
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    let orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
      paymentMethod: method,
    };

    switch (method) {
      case "cod": {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("✅ Order placed successfully!");
          setCartItems({});
          setTimeout(() => navigate("/orders"), 1500);
        } else {
          toast.error(response.data?.message || "Something went wrong");
        }
        break;
      }

      case "stripe": {
        const responseStripe = await axios.post(
          backendUrl + "/api/order/stripe",
          orderData,
          { headers: { token } }
        );
        if (responseStripe.data.success) {
          toast.success("Redirecting to Stripe payment...");
          const { session_url } = responseStripe.data;
          window.location.replace(session_url);
        } else {
          toast.error(responseStripe.data?.message || "Something went wrong");
        }
        break;
      }

      case "razorpay": {
        const responseRazorpay = await axios.post(
          backendUrl + "/api/order/razorpay",
          orderData,
          { headers: { token } }
        );
        if (responseRazorpay.data.success) {
          toast.info("Opening Razorpay payment...");
          initPay(responseRazorpay.data.order);
        } else {
          toast.error(responseRazorpay.data?.message || "Something went wrong");
        }
        break;
      }

      default:
        toast.error("Invalid payment method");
        break;
    }
  } catch (error) {
    console.log(error);
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Something went wrong from catch"
    );
  }
};

  return (
    <form onSubmit={onSubmithandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* left side  */}
      <div className="flex  flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
          onChange={onChangehandler}
          name='firstName'
          value={formData.firstName}
          required
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangehandler}
          name='lastName'
          value={formData.lastName}
            type="text"
            placeholder="Last name"
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          onChange={onChangehandler}
          name='email'
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          type="text"
            onChange={onChangehandler}
          name='street'
          value={formData.street}
          placeholder="Street"
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            type="text"
              onChange={onChangehandler}
          name='city'
          value={formData.city}
            placeholder="City"
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
              onChange={onChangehandler}
          name='state'
          value={formData.state}
            placeholder="State"
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangehandler}
          name='zipcode'
          value={formData.zipcode}
            type="number"
            placeholder="ZipCode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
              onChange={onChangehandler}
          name='country'
          value={formData.country}
            placeholder="Country"
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="number"
              onChange={onChangehandler}
          name='phone'
          value={formData.phone}
            placeholder="Phone Number"
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
      </div>
      {/* right side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        {/* payment method selection  */}
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* payment method selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            {/* stripe payment method  */}
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                } `}
              ></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
            </div>
            {/* razorpay payment method  */}
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                } `}
              ></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
            </div>
            {/* cod payment method  */}
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                } `}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
<button  type="submit" className="bg-black text-white px-16 py-3 text-sm">Place Order</button>
          </div>
        </div>

      </div>
    </form>
  );
};

export default PlaceOrder;
