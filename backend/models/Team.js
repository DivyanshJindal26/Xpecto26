import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    team: {
      type: String,
      required: [true, "Team/Role is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Add index for sorting
teamSchema.index({ order: 1 });

const Team = mongoose.model("Team", teamSchema);
export default Team;
