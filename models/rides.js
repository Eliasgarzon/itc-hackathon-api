import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },

  date: { type: Date, default: Date.now },

  pickOff: {
    type: object,
    required: [true, "where do you want to start your ride?"],
  },

  dropOff: {
    type: object,
    required: [true, "where do you want to end your ride?"],
  },

  rideTime: {
    type: string,
    required: [true, "what time you want to start your ride?"],
  },

  rideStatus: {
    type: Number,
    required: [true, "A ride must have a status."],
    default: 0,
    enum: {
      values: [0, 1, 2, 3, 4],
      message: "Please select a valid number from 1-4 according to the stages definition. (see docs)",
    },
  },
  requestRef: [{ type: mongoose.Schema.ObjectId, ref: "requests" }],
  chosenRide: { type: mongoose.Schema.ObjectId, ref: "requests" },
});

const ride = mongoose.model("ride", rideSchema);

export default ride;
