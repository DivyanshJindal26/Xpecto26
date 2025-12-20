import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    club_name: {
      type: String,
    },
    venue: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    duration: {
      type: String
    },
    date: {
      type: Date,
      required: true,
    },
    image: [
      {
        type: String,
      }
    ],
    registrationLimit: {
      type: Number
    },
    company: {
        type: String,
    }
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;