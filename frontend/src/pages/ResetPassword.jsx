import React, { useEffect } from "react";
import { assets } from "../assets/frontend_assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {  ShopContext } from "../context/ShopContext.jsx";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  axios.defaults.withCredentials = true;
  const [resendLoading, setResendLoading] = useState(false); // for resend button
  const [timer, setTimer] = useState(30); // countdown for resending OTP
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState("");

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/user/send-reset-otp"
      ,{ email });

      if (data.success) {
        toast.success("OTP resent successfully!");
        setTimer(30); // reset timer
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };
//   const onSubmitOtp = async (e) => {
    
//     e.preventDefault();
//     const otpArray = inputRefs.current.map((e) => e.value);
//     // setOtp(otpArray.join("").trim());

// const enteredOtp = otpArray.join("").trim();
//   setOtp(enteredOtp);
//       setIsOtpSubmited(true);
//   };
const onSubmitOtp = async (e) => {
  e.preventDefault();
  const otpArray = inputRefs.current.map((ref) => ref.value);
  const enteredOtp = otpArray.join("").trim();

  if (!enteredOtp) return toast.error("Please enter OTP");

  try {
    const { data } = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
      email,
      otp: enteredOtp,
    });

    if (data.success) {
      toast.success(data.message);
      setOtp(enteredOtp);
      setIsOtpSubmited(true); // now show new password form
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  const onSubmitedNewPassword = async (e) => {
   e.preventDefault();
    if (!otp) return toast.error("Please enter OTP first");
  if (!newPassword) return toast.error("Please enter new password");
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        {email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };
 
  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-slate-100">
     
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter Your Registered Email Address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input
              type="email"
              placeholder="email id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 hover:cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit{" "}
          </button>
        </form>
      )}
      {/* //otp input form */}
      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            {" "}
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-Digit code sent to Your email id.
          </p>
          <div className="flex justify-between mb-12 " onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-lg hover:cursor-pointer">
            Submit
          </button>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className={`text-sm text-indigo-400 hover:underline ${
                timer > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleResendOtp}
              disabled={timer > 0 || resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
            {timer > 0 && (
              <span className="text-gray-300 text-sm">{timer}s</span>
            )}
          </div>
        </form>
      )}
      {/* enter new password */}
      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitedNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the New Password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              
              required
            />
          </div>
          <button className="w-full py-2.5 hover:cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit{" "}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
