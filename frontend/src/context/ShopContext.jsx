import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import Product from "../pages/Product";
import { useNavigate } from "react-router-dom";
import axios from "axios"
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  axios.defaults.withCredentials= true;
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
    // const [isLoggedin, setIsLoggedin] = useState(false);
    // const [userData, setUserData] = useState(false);
    // const [token,setToken] = useState('')
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products,setProducts] = useState([])
  //code updated from copilot 
  // persist token across refreshes
 const [token, setToken] = useState(() => localStorage.getItem("token") || "");
 useEffect(() => {
   if (token) localStorage.setItem("token", token);
   else localStorage.removeItem("token");
 }, [token]);
// set initial logged-in state from token
const [isLoggedin, setIsLoggedin] = useState(!!(localStorage.getItem("token")));
  const [userData, setUserData] = useState(false);
 /// the end of edited code from copilot
 
  const navigate = useNavigate();
  const addToCart = async (itemId, size) => {
    
    if (!size) {
      toast.error("select product size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
       else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers:{token}})
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', {itemId,size,quantity},{headers:{token}})
      } catch (error) {
         console.log(error)
        toast.error(error.message)
      }
    }
  };
  const getCartAmount = (e) => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getProductData = async()=>{
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
if (response.data.success) {
setProducts(response.data.products)
} else {
  toast.error(response.data.message)
}    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  const getUserCart = async (token) =>{
    try {
      const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
   if(response.data.success){
    setCartItems(response.data.cartData)
   }
    } catch (error) {
       console.log(error)
        toast.error(error.message)
    }
  }
  useEffect(()=>{
    getProductData()
  },[])
  useEffect(()=>{
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
  },[])
  const value = {
    products,
    delivery_fee,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    isLoggedin,
    setIsLoggedin,
     userData,
    setUserData,
    navigate,backendUrl,token,setToken,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
