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
    rulebook: {
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
      },
    ],
    company: {
      type: String,
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
