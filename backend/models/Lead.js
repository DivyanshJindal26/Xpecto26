import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    collegeName: {
      type: String,
      trim: true,
    },
    passType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentProof: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentProof",
    },
    campusAmbassadorCode: {
      type: String,
      trim: true,
    },
    selectedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    numberOfParticipants: {
      type: Number,
      min: 1,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
