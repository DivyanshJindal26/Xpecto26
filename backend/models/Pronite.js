import mongoose from "mongoose";

const proniteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
    },
    date: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    artist: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    image: {
      type: String,
    },
    ticketPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    maxCapacity: {
      type: Number,
      default: 500,
      required: true,
    },
    availableTickets: {
      type: Number,
      default: 500,
    },
    upiId: {
      type: String,
    },
    paymentQrImage: {
      type: String,
    },
    // Emails allowed to verify registrations
    verifierEmails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    // Emails allowed to scan QR codes at entry
    scannerEmails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Pronite = mongoose.model("Pronite", proniteSchema);
export default Pronite;
