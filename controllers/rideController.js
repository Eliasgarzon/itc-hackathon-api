import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Ride from "../models/rides.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";
import { application } from "express";

export const getAllRides = getAll(Ride);
export const getRide = getOne(Ride);
export const createRide = createOne(Ride);
export const updateRide = updateOne(Ride);

export const rideDefaults = (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
};

// export const deleteRide = deleteRide(Ride);
