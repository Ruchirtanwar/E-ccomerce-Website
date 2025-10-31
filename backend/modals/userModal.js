import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
      address: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    verifyOtp: { type: String, default: "" },
   verifyOtpExpireAt: { type: Number, default: 0 },
  },
  { minimize: false },{ timestamps: true }
);
const userModal = mongoose.models.user || mongoose.model("user", userSchema);
export default userModal;
