import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
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
      },
    ],
    company: {
      type: String,
    },
  },
  { timestamps: true },
);

const Exhibition = mongoose.model("Exhibition", exhibitionSchema);
export default Exhibition;
