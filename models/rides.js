import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  pickUp: {
    type: Object,
    required: [true, "Please include the starting location"],
  },
  dropOff: {
    type: Object,
    required: [true, "Please include a destination"],
  },
  rideTime: {
    type: Date,
    default: Date.now(),
    required: [true, "The time of day must be specified"],
  },
  rideStatus: {
    type: Number,
    required: [true, "A ride must have a status."],
    default: 0,
    enum: {
      values: [0, 1, 2, 3, 4],
      message:
        "Please select a valid number from 0-4 according to the stages definition. (see docs)",
    },
  },
  requestRef: [{ type: mongoose.Schema.ObjectId, ref: "requests" }],
  chosenRide: { type: mongoose.Schema.ObjectId, ref: "requests" },
});

const ride = mongoose.model("ride", rideSchema);

export default ride;
