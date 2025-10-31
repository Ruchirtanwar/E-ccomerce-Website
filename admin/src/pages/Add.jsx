import React, { useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})
 if (response.data.success) {
  toast.success(response.data.message)
  setName('')
  setDescription('')
  setImage1(false)
    setImage2(false)
  setImage3(false)
  setImage4(false)

 }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  return (
    // <form onSubmit={onSubmitHandler} action="" className="flex flex-col w-full items-start gap-3">
    //   <div>
    //     <p className="mb-2">Upload Images</p>
    //     <div className="flex gap-2">
    //       <label htmlFor="image1">
    //         <img
    //           className="w-20"
    //           src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
    //           alt=""
    //         />
    //         <input
    //           onChange={(e) => setImage1(e.target.files[0])}
    //           type="file"
    //           id="image1"
    //           hidden
    //         />
    //       </label>
    //       <label htmlFor="image2">
    //         <img
    //           className="w-20"
    //           src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
    //           alt=""
    //         />
    //         <input
    //           onChange={(e) => setImage2(e.target.files[0])}
    //           type="file"
    //           id="image2"
    //           hidden
    //         />
    //       </label>{" "}
    //       <label htmlFor="image3">
    //         <img
    //           className="w-20"
    //           src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
    //           alt=""
    //         />
    //         <input
    //           onChange={(e) => setImage3(e.target.files[0])}
    //           type="file"
    //           id="image3"
    //           hidden
    //         />
    //       </label>{" "}
    //       <label htmlFor="image4">
    //         <img
    //           className="w-20"
    //           src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
    //           alt=""
    //         />
    //         <input
    //           onChange={(e) => setImage4(e.target.files[0])}
    //           type="file"
    //           id="image4"
    //           hidden
    //         />
    //       </label>
    //     </div>
    //   </div>
    //   <div>
    //     <p>Product Name</p>
    //     <input
    //       type="text"
    //       placeholder="Type here"
    //       required
    //       onChange={(e) => setName(e.target.value)}
    //       value={name}
    //       className="w-full max-w-[500px] px-3 py-2"
    //     />
    //   </div>

    //   <div>
    //     <p>Product Description</p>
    //     <textarea
    //       type="text"
    //       placeholder="Write content here"
    //       required
    //       onChange={(e) => setDescription(e.target.value)}
    //       value={description}
    //       className="w-full max-w-[500px] px-3 py-2"
    //     />
    //   </div>
    //   <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
    //     <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
    //       <p>Product Category</p>
    //       <select
    //         onChange={(e) => setCategory(e.target.value)}
    //         className="w-full px-3 py-2"
    //         name=""
    //         id=""
    //       >
    //         <option value="Men">Men</option>
    //         <option value="Women">Women</option>
    //         <option value="Kids">Kids</option>
    //       </select>
    //     </div>
    //     <div>
    //       <p>Sub Category</p>
    //       <select
    //         onChange={(e) => setSubCategory(e.target.value)}
    //         className="w-full px-3 py-2"
    //         name=""
    //         id=""
    //       >
    //         <option value="Topwear">TopWear</option>
    //         <option value="Bottomwear">BottomWear</option>
    //         <option value="Winterwear">Winterwear</option>
    //       </select>
    //     </div>
    //     <div>
    //       <p className="mb-2">Product Price</p>
    //       <input
    //         type="Number"
    //         onChange={(e) => setPrice(e.target.value)}
    //         value={price}
    //         className="w-full  px-3 py-2 sm:w-[120px]"
    //         placeholder="25"
    //       />
    //     </div>
    //     <div>
    //       <p className="mb-2">Product Sizes</p>
    //       <div className="flex gap-3">
    //         <div
    //           onClick={() =>
    //             setSizes((prev) =>
    //               prev.includes("S")
    //                 ? prev.filter((item) => item !== "S")
    //                 : [...prev, "S"]
    //             )
    //           }
    //         >
    //           <p
    //             className={`${
    //               sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"
    //             }  px-3 py-1 cursor-pointer`}
    //           >
    //             S
    //           </p>
    //         </div>
    //         <div
    //           onClick={() =>
    //             setSizes((prev) =>
    //               prev.includes("M")
    //                 ? prev.filter((item) => item !== "M")
    //                 : [...prev, "M"]
    //             )
    //           }
    //         >
    //           <p
    //             className={`${
    //               sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"
    //             }  px-3 py-1 cursor-pointer`}
    //           >
    //             M
    //           </p>
    //         </div>
    //         <div
    //           onClick={() =>
    //             setSizes((prev) =>
    //               prev.includes("L")
    //                 ? prev.filter((item) => item !== "L")
    //                 : [...prev, "L"]
    //             )
    //           }
    //         >
    //           <p
    //             className={`${
    //               sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"
    //             } px-3 py-1 cursor-pointer`}
    //           >
    //             L
    //           </p>
    //         </div>
    //         <div
    //           onClick={() =>
    //             setSizes((prev) =>
    //               prev.includes("XL")
    //                 ? prev.filter((item) => item !== "XL")
    //                 : [...prev, "XL"]
    //             )
    //           }
    //         >
    //           <p
    //             className={`${
    //               sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"
    //             } px-3 py-1 cursor-pointer`}
    //           >
    //             XL
    //           </p>
    //         </div>
    //         <div
    //           onClick={() =>
    //             setSizes((prev) =>
    //               prev.includes("XXL")
    //                 ? prev.filter((item) => item !== "XXL")
    //                 : [...prev, "XXL"]
    //             )
    //           }
    //         >
    //           <p
    //             className={`${
    //               sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"
    //             } py-1 px-3 cursor-pointer`}
    //           >
    //             XXL
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex gap-2 mt-2">
    //       <input onChange={()=> setBestseller(prev=> !prev)} checked={bestseller} type="checkbox" id="bestseller" />
    //       <label htmlFor="bestseller"  className="cursor-pointer">
    //         Add to bestseller
    //       </label>
    //     </div>
    //   </div>
    //   <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
    //     ADD
    //   </button>
    // </form>
    //updated css code by chat gpt
    <form
  onSubmit={onSubmitHandler}
  className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md gap-6"
>
  {/* Image Upload Section */}
  <div>
    <p className="mb-2 font-semibold text-gray-700">Upload Images</p>
    <div className="flex flex-wrap gap-4">
      {[image1, image2, image3, image4].map((image, i) => (
        <label key={i} htmlFor={`image${i + 1}`} className="cursor-pointer">
          <img
            className="w-24 h-24 object-cover border border-gray-300 rounded-md"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
          />
          <input
            onChange={(e) => {
              const file = e.target.files[0];
              [setImage1, setImage2, setImage3, setImage4][i](file);
            }}
            type="file"
            id={`image${i + 1}`}
            hidden
          />
        </label>
      ))}
    </div>
  </div>

  {/* Product Name */}
  <div className="w-full">
    <p className="mb-1 font-medium text-gray-700">Product Name</p>
    <input
      type="text"
      placeholder="Type here"
      required
      onChange={(e) => setName(e.target.value)}
      value={name}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>

  {/* Product Description */}
  <div className="w-full">
    <p className="mb-1 font-medium text-gray-700">Product Description</p>
    <textarea
      placeholder="Write content here"
      required
      onChange={(e) => setDescription(e.target.value)}
      value={description}
      className="w-full border border-gray-300 rounded-md px-4 py-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>

  {/* Category / Subcategory / Price / Bestseller */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
    <div>
      <p className="mb-1 font-medium text-gray-700">Category</p>
      <select
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>
    </div>

    <div>
      <p className="mb-1 font-medium text-gray-700">Subcategory</p>
      <select
        onChange={(e) => setSubCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="Topwear">TopWear</option>
        <option value="Bottomwear">BottomWear</option>
        <option value="Winterwear">Winterwear</option>
      </select>
    </div>

    <div>
      <p className="mb-1 font-medium text-gray-700">Price ($)</p>
      <input
        type="number"
        onChange={(e) => setPrice(e.target.value)}
        value={price}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        placeholder="25"
      />
    </div>

    <div className="flex items-center gap-2 mt-6">
      <input
        onChange={() => setBestseller((prev) => !prev)}
        checked={bestseller}
        type="checkbox"
        id="bestseller"
      />
      <label htmlFor="bestseller" className="text-sm font-medium text-gray-700 cursor-pointer">
        Add to Bestseller
      </label>
    </div>
  </div>

  {/* Sizes */}
  <div>
    <p className="mb-1 font-medium text-gray-700">Available Sizes</p>
    <div className="flex flex-wrap gap-3">
      {["S", "M", "L", "XL", "XXL"].map((size) => (
        <div
          key={size}
          onClick={() =>
            setSizes((prev) =>
              prev.includes(size)
                ? prev.filter((item) => item !== size)
                : [...prev, size]
            )
          }
          className={`px-4 py-1 rounded-full cursor-pointer border text-sm ${
            sizes.includes(size)
              ? "bg-black text-white border-black"
              : "bg-gray-200 text-gray-700 border-gray-300"
          }`}
        >
          {size}
        </div>
      ))}
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full sm:w-40 py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800 transition"
  >
    Add Product
  </button>
</form>

  );
};

export default Add;
