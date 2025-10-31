import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [activeImages, setActiveImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    //     <div>
    //       <p className="mb-2">All Products List</p>
    //       <div className="flex flex-col gap-2">
    //         {/* list table titles */}
    //         <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
    //           <b>Image</b>
    //           <b>Name</b>
    //           <b>Category</b>
    //           <b>Price</b>
    //           <b className="text-center">Action</b>
    //         </div>
    //        {/* product lists  */}
    //        {
    //         list.map((item,index)=>(
    //           <div key={index} className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
    // <img src={item.image[0]} alt="" />
    //           <p>{item.name}</p>
    //           <p>{item.category}</p>
    //           <p>{currency}{item.price}</p>
    //           <p onClick={()=> removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg">X</p>
    //           </div>
    //         ))
    //        }
    //       </div>
    //     </div>
    //updated css code by chatgpt
    <div className="w-full">
      <p className="mb-4 text-lg font-semibold">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* Table Headers - only shown on md and up */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr] grid-cols-1 gap-4 md:gap-2 py-3 px-3 border rounded-md text-sm bg-white shadow-sm"
          >
            {/* Image
        <div className="flex items-center md:block">
          <img
            src={item.image[0]}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-md"
          />
        </div> */}
            {/* updated code with showModal */}
            {/* Image */}
            <div
              className="flex items-center md:block cursor-pointer"
              onClick={() => {
                setActiveImages(item.image); // all product images
                setShowModal(true);
              }}
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md transition-transform duration-200 hover:scale-105"
                title="Click to view all images"
              />
            </div>

            {/* Name */}
            <div className="flex mt-6 items-center md:block">
              <p className="font-medium">{item.name}</p>
            </div>

            {/* Category */}
            <div className="flex mt-6 items-center md:block">
              <p>{item.category}</p>
            </div>

            {/* Price */}
            <div className="flex mt-6 items-center md:block">
              <p>
                {currency}
                {item.price}
              </p>
            </div>

            {/* Action */}
            <div className="flex justify-end md:justify-center items-center">
              <button
                onClick={() => removeProduct(item._id)}
                className=" text-base font-semibold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative shadow-lg">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
              >
                &times;
              </button>

              <h2 className="text-lg font-semibold mb-4">Product Images</h2>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activeImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Product image ${idx + 1}`}
                    className="w-full h-40 object-center rounded border"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
