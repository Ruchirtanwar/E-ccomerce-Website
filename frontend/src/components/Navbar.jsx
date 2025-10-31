import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
  const [Visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const profileRef = useRef(null);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
  } = useContext(ShopContext);

  // close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/user/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/login");
        setToken("");
        setCartItems({});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-between py-5 font-medium ">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-36" />
      </Link>
      <ul className=" hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="  flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className=" hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink to="/collection" className=" flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className=" hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>{" "}
        <NavLink to="/about" className=" flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className=" hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>{" "}
        <NavLink to="/contact" className=" flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />
        <div
          ref={profileRef}
          className="relative"
          onMouseEnter={() => setIsHoveringProfile(true)}
          onMouseLeave={() => setIsHoveringProfile(false)}
        >
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
            onClick={() => {
              if (!token) navigate("/login");
              else setShowProfileMenu((s) => !s);
            }}
          />
          {/* dropdown menu - visible on hover OR click when token exists */}
          {token && (
            <div
              className={`absolute right-0 pt-4 dropdown-menu ${
                (isHoveringProfile || showProfileMenu) ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-lg">
                <p className="cursor-pointer hover:text-black hover:text-xl" onClick={()=> { setShowProfileMenu(false); navigate('/myprofile'); }}>
                  My Profile
                </p>
                <p onClick={()=> { setShowProfileMenu(false); navigate('/orders'); }} className="cursor-pointer hover:text-black hover:text-xl">
                  Orders
                </p>
                <p
                  onClick={() => { setShowProfileMenu(false); logout(); }}
                  className="cursor-pointer hover:text-black hover:text-xl"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5  min-w-5 " alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[9px] font-bold">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 left-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${
          Visible
            ? " opacity-100 pointer-events-auto w-full"
            : "opacity-0 pointer-events-none w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-x-0"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-x-0"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-x-0"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-x-0"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
