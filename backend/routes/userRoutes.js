// routes/userRoutes.js
import express from "express";
import { loginUser,registerUser,adminLogin, logout, sendResetOtp, resetPassword, verifyResetOtp, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
const userRouter = express.Router();
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/logout',logout)
userRouter.post('/send-reset-otp',sendResetOtp)
userRouter.post('/reset-password',resetPassword)
userRouter.post("/verify-reset-otp", verifyResetOtp);
// Get user profile
userRouter.get("/profile", userAuth, getUserProfile);

// Update user profile
userRouter.put("/update-profile", userAuth, updateUserProfile);

userRouter.get("/verify", userAuth, async (req, res) => {
  try {
    const user = await userModal.findById(req.user).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: "User not found" });
  }
});
export default userRouter;