import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
export default Sponsor;
