import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    fullName: { type: String },
    email: { type: String },
    phone: { type: String, unique: true }, // removed `required: true`

    wallet: { type: Number, default: 0 },

    subscription: {
      plan: { type: String },
      paymentId: { type: String },
      orderId: { type: String },
      date: { type: Date },
      expiry: { type: Date },
      status: { type: String, enum: ["active", "inactive"], default: "inactive" },
      maxAccounts: { type: Number, default: 0 },
      accounts: [
        {
          googleId: String,
          email: String,
          listingData: Object,
        },
      ],
    },

    // Store OTP temporarily for verification
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
