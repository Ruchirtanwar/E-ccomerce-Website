// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [currentState, setCurrentState] = useState("login");
//   const {token,setToken,navigate,backendUrl} = useContext(ShopContext)
//   const [name,setName] = useState('')
//   const [password,setPassword] = useState('')
//   const [email,setEmail] = useState('')
  

//   const onSubmitHandler = async (e)=>{
//     e.preventDefault()
  
//     try {
//       if (currentState === "Sign Up") {
//         const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
        
//        if(response.data.success){
//         setToken(response.data.token)

//         localStorage.setItem('token',response.data.token)
//        }
//        else {
//         toast.error(response.data.message)
//       }
//       } else {
//         const response = await axios.post(backendUrl + '/api/user/login',{email,password},{
//   withCredentials: true, // required for cookies to be sent
// }
// )
//   if (response.data.success) {
//     setToken(response.data.token)
//   localStorage.setItem('token',response.data.token)
//   }
//   else {
//         toast.error(response.data.message)
//       }
//       }
//     } catch (error) {
//       console.log(error)
//             toast.error(error.message)

//     }
//   }
// //   const onSubmitHandler = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const url = currentState === "Sign Up"
// //       ? `${backendUrl}/api/user/register`
// //       : `${backendUrl}/api/user/login`;

// //     const resp = await fetch(url, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       credentials: 'include', // Send cookies
// //       body: JSON.stringify(
// //         currentState === "Sign Up"
// //           ? { name, email, password }
// //           : { email, password }
// //       )
// //     });

// //     const data = await resp.json();

// //     if (data.success) {
// //       // You don't actually need to store token in localStorage if using cookies
// //       setToken("cookie"); // optional: use a placeholder to trigger useEffect
// //     } else {
// //       toast.error(data.message);
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     toast.error(error.message);
// //   }
// // };
// // const handleLogout = async () => {
// //   try {
// //     const resp = await fetch(`${backendUrl}/api/user/logout`, {
// //       method: 'POST',
// //       credentials: 'include',
// //     });
// //     const data = await resp.json();
// //     if (data.success) {
// //       setToken(null);
// //       localStorage.removeItem("token"); // Optional: if you’re storing token
// //       toast.success("Logged out");
// //       navigate('/login');
// //     } else {
// //       toast.error(data.message);
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     toast.error("Logout failed");
// //   }
// // };

//   useEffect(()=>{
//     if(token){
//       navigate('/')
//     }
//   },[token])
//   return (
//     <form
//      onSubmit={onSubmitHandler}
//       action=""
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-600"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl">{currentState}</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>
//      {currentState === 'login'?'':  <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className="w-full px-3 py-2 border border-gray-800 " placeholder="Name" />}
//         <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email}  className="w-full px-3 py-2 border border-gray-800 " placeholder="Email" required />
//       <input type='password'onChange={(e)=>setPassword(e.target.value)} value={password}  className="w-full px-3 py-2 border border-gray-800 " placeholder="Password" required />
// <div className="w-full flex justify-between text-sm mt-[-8px]">
// <p className="cursor-pointer">Forget Your Password</p>
// {
//   currentState === 'login'
//   ? 
//   <p onClick={()=>setCurrentState('Sign Up')} className="cursor-pointer">Create Your Account</p>
// :
//   <p onClick={()=>setCurrentState('login')} className="cursor-pointer">Login Here</p>

// }
// </div>
//   <button className="bg-black text-white font-light px-8 py-2 mt-4">{currentState === 'login' ? 'Sign In' :'Sign Up'}</button>
//     </form>
//   );
// };

// export default Login;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
const Login = () => {
  const [currentState, setCurrentState] = useState("login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (currentState === "Sign Up") {
        // ✅ REGISTER
        response = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, password },
          { withCredentials: true } // required to store cookie
        );
      } else {
        // ✅ LOGIN
        response = await axios.post(
          `${backendUrl}/api/user/login`,
          { email, password },
          { withCredentials: true } // required to send/receive cookie
        );
      }

      if (response.data.success) {
        // ✅ Store token (if backend also sends it for manual API headers)
        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          // If using only cookies (no manual header auth)
          setToken("cookie"); // a placeholder to mark login state
        }

        toast.success(
          currentState === "Sign Up"
            ? "Account created successfully!"
            : "Logged in successfully!"
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-600"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "login" ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
        />
      )}

      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer"  onClick={()=> navigate("/resetpassword") }
       >Forget Your Password</p>
        {currentState === "login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create Your Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
