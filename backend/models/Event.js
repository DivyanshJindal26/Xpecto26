import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
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
    club_name: {
      type: String,
    },
    date: {
      type: Date,
    },
    image: [
      {
        type: String,
      }
    ],
    company: {
      type: String,
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    maxCapacity: {
      type: Number,
      default: 200,
    },
    availableTickets: {
      type: Number,
      default: 200,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
