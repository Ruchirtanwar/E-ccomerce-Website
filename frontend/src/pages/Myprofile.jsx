// import React, { useState } from "react";
// import { User, Mail, MapPin, Edit3, LogOut } from "lucide-react";

// const MyProfile = () => {
//   const [user, setUser] = useState({
//     name: "Ruchir Tanwar",
//     email: "ruchir@example.com",
//     address: "Gurugram, Haryana, India",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [updatedData, setUpdatedData] = useState(user);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleSave = () => {
//     setUser(updatedData);
//     setIsEditing(false);
//   };


//   return (
//     <div className="max-w-4xl mx-auto px-6 py-10">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
//         My Profile
//       </h2>

//       {/* Profile Card */}
//       <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
        

//         <div className="flex-1 w-full">
//           {!isEditing ? (
//             <>
//               <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//                 <User size={20} /> {user.name}
//               </h3>
//               <p className="text-gray-600 flex items-center gap-2 mt-2">
//                 <Mail size={18} /> {user.email}
//               </p>
//               <p className="text-gray-600 flex items-center gap-2 mt-2">
//                 <MapPin size={18} /> {user.address}
//               </p>

//               <div className="mt-6 flex gap-3">
//                 <button
//                   onClick={handleEdit}
//                   className="px-5 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
//                 >
//                   <Edit3 size={18} /> Edit Profile
//                 </button>
               
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="flex flex-col gap-4">
//                 <input
//                   type="text"
//                   value={updatedData.name}
//                   onChange={(e) =>
//                     setUpdatedData({ ...updatedData, name: e.target.value })
//                   }
//                   className="border rounded-lg p-2 w-full"
//                   placeholder="Full Name"
//                 />
//                 <input
//                   type="email"
//                   value={updatedData.email}
//                   onChange={(e) =>
//                     setUpdatedData({ ...updatedData, email: e.target.value })
//                   }
//                   className="border rounded-lg p-2 w-full"
//                   placeholder="Email Address"
//                 />
//                 <input
//                   type="text"
//                   value={updatedData.address}
//                   onChange={(e) =>
//                     setUpdatedData({ ...updatedData, address: e.target.value })
//                   }
//                   className="border rounded-lg p-2 w-full"
//                   placeholder="Address"
//                 />
//               </div>
//               <div className="mt-5 flex gap-3">
//                 <button
//                   onClick={handleSave}
//                   className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Orders Section */}
//       <div className="mt-10">
//         <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//           Recent Orders
//         </h3>
//         <div className="bg-white rounded-2xl shadow divide-y">
//           {[1, 2, 3].map((order) => (
//             <div
//               key={order}
//               className="flex justify-between items-center p-5 hover:bg-gray-50"
//             >
//               <div>
//                 <p className="font-medium text-gray-800">Order #{1000 + order}</p>
//                 <p className="text-sm text-gray-500">
//                   Placed on {new Date().toDateString()}
//                 </p>
//               </div>
//               <span className="px-4 py-1 text-sm bg-green-100 text-green-700 rounded-full">
//                 Delivered
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, MapPin, Edit3, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import {  ShopContext } from "../context/ShopContext.jsx";
import { useContext } from "react";


const MyProfile = () => {
    const { backendUrl,token } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(backendUrl +"/api/user/profile", {
          headers: { token },
        });
        if (data.success) {
          setUser(data.user);
          setUpdatedData(data.user);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // Save updated profile
  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        backendUrl + "/api/user/update-profile",
        updatedData,
        { headers: { token } }
      );
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };


  if (!user) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
        My Profile
      </h2>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
        

        <div className="flex-1 w-full">
          {!isEditing ? (
            <>
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <User size={20} /> {user.name}
              </h3>
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <Mail size={18} /> {user.email}
              </p>
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <MapPin size={18} /> {user.address || "No address added"}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
                
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={updatedData.name}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, name: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={updatedData.email}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, email: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  placeholder="Email Address"
                />
                <input
                  type="text"
                  value={updatedData.address}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, address: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  placeholder="Address"
                />
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
