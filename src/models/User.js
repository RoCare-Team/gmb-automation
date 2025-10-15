import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
        fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    subscription: {
       plan: { type: String },
      paymentId: { type: String },
      orderId: { type: String },
      date: { type: Date },
      status: { type: String, enum: ["active", "inactive"], default: "inactive" },
      maxAccounts: Number, // control how many Google accounts can be linked
      accounts: [
        {
          googleId: String,
          email: String,
          listingData: Object,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
