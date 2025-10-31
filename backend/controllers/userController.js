import userModal from "../modals/userModal.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
// route for user  login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModal.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "user doesn't exists" });
    }
    //  console.log("Stored hashed password:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // const token = createToken(user._id);
      // res.json({success:true, token})
      // const cookieOptions = {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      //   maxAge: Number(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // default 1 day in ms
      // };
      // res.cookie("token", token, cookieOptions);
      // res.status(200).json({
      //   success: true,
      //   user: {
      //     id: user._id,
      //     name: user.name,
      //     email: user.email,
      //     role: user.role,
      //   },
      // });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/", // important for all routes
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//route for user register
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     //checking user already exists or not
//     const exists = await userModal.findOne({ email });
//     if (exists) {
//       return res.json({ success: false, message: "User already exists" });
//     }
//     //validating  email format & strong pssword
//     if (!validator.isEmail(email)) {
//       return res.json({
//         success: false,
//         message: "please enter a valid email",
//       });
//     }
//     if (password.length < 8) {
//       return res.json({
//         success: false,
//         message: "please enter a strong password",
//       });
//     }
//     //hashing user password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = new userModal({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     const user = await newUser.save();
//     const token = createToken(user._id);
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//       maxAge: Number(process.env.COOKIE_MAX_AGE) ||  60 * 60 * 1000, // default 1 day in ms
//     };
//     res.cookie("token", token, cookieOptions);
//     res.status(200).json({ success: true, token });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// by chat gpt using cookie

// ✅ Combined Register Controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔹 Basic field validation
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    // 🔹 Check if user already exists
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // 🔹 Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // 🔹 Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (min 8 chars)",
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create new user
    const user = new userModal({ name, email, password: hashedPassword });
    await user.save();

    // 🔹 Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🔹 Cookie configuration
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: " welcome to testing subject with me",
      text: `welcome to my demo session,your email is only targeted to test my email and other verification parts ,you have officially created an account on my demo websites with email id: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    // 🔹 Send success response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({ success: false, message: error.message });
  }
};

//route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add a logout handler near other controllers:
const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };
  res.clearCookie(
    "token",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    },
    cookieOptions
  );
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
// reset password otp
const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "email is Required" });
  }
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 8 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `your otp for resetting your password is ${otp}.You this OTP to proceed with resetting your Password.`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "reset OTP send on your Email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//reset User Password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "Email is Required",
    });
  }
  if (!otp) {
    return res.json({
      success: false,
      message: "otp is Required",
    });
  }
  if (!newPassword) {
    return res.json({
      success: false,
      message: "new password is Required",
    });
  }
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Passowrd has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify Reset OTP
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.json({ success: false, message: "Email and OTP required" });

  try {
    const user = await userModal.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.resetOtp || user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    // ✅ OTP verified successfully
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// 📘 Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModal.findById(req.user).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✏️ Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    const user = await userModal
      .findByIdAndUpdate(req.user, { name, email, address }, { new: true })
      .select("-password");

    return res.json({ success: true, message: "Profile updated", user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  logout,
  sendResetOtp,
  resetPassword,
  verifyResetOtp,
  updateUserProfile,
  getUserProfile,
};
