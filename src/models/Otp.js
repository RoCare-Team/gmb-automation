import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
