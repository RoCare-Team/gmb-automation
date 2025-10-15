import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // ✅ remove unique:true
    prompt: { type: String, required: true },
    output: { type: String }, // AI image URL
    status: {
      type: String,
      enum: ["pending", "approved", "scheduled"],
      default: "pending",
    },
    scheduledDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
