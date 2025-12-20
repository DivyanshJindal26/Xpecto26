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
    },
    genre: {
      type: String,
    },
    image: [
      {
        type: String,
      }
    ],
    ticketPrice: {
      type: Number,
      default: 0,
    },
    maxCapacity: {
      type: Number,
      default: 500,
    },
    availableTickets: {
      type: Number,
      default: 500,
    },
  },
  { timestamps: true }
);

const Pronite = mongoose.model("Pronite", proniteSchema);
export default Pronite;
