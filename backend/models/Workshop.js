import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
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
    duration: {
      type: String,
    },
    instructor: {
      type: String,
    },
    company: {
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
      default: 100,
    },
    availableTickets: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const Workshop = mongoose.model("Workshop", workshopSchema);
export default Workshop;
