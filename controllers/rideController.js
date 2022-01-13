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
import Request from "../models/requests.js";
import axios from "axios";

export const getAllRides = getAll(Ride);
export const getRide = getOne(Ride);
export const createRide = createOne(Ride);
export const updateRide = updateOne(Ride);

export const filterMyRides = (req, res, next) => {
  req.query = { createdBy: req.user.id };
  next();
};

export const rideDefaults = catchAsync(async (req, res, next) => {
  const { pickUp, dropOff } = req.body;
  const input = {
    pickup_day: 0,
    pickup_hour: 12,
    pickup_minute: 0,
    passenger_count: 1,
    trip_distance: 3,
    pickup_longitude: pickUp.coordinates[1],
    pickup_latitude: pickUp.coordinates[0],
    dropoff_longitude: dropOff.coordinates[1],
    dropoff_latitude: dropOff.coordinates[0],
  };

  const response = await axios.get(
    `http://ec2-18-157-157-205.eu-central-1.compute.amazonaws.com:8080/predict_price?pickup_day=${0}&pickup_hour=${12}&pickup_minute=${0}&pickup_longitude=${
      pickUp.coordinates[1]
    }&pickup_latitude=${
      pickUp.coordinates[0]
    }&trip_distance=${6}&dropoff_longitude=${
      dropOff.coordinates[1]
    }&dropoff_latitude=${dropOff.coordinates[0]}&passenger_count=${1}`
  );
  const responseTwo = await axios.get(
    `http://ec2-18-157-157-205.eu-central-1.compute.amazonaws.com:8080/predict_price?pickup_day=${0}&pickup_hour=${12}&pickup_minute=${0}&pickup_longitude=${
      pickUp.coordinates[1]
    }&pickup_latitude=${
      pickUp.coordinates[0]
    }&trip_distance=${6}&dropoff_longitude=${
      dropOff.coordinates[1]
    }&dropoff_latitude=${dropOff.coordinates[0]}&passenger_count=${2}`
  );

  if (response?.data) {
    req.body.priceAlone = response.data;
  }
  if (responseTwo?.data) {
    req.body.priceSplit = response.data;
  }
  req.body.createdBy = req.user.id;
  next();
});

export const closeRide = catchAsync(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);
  if (ride.status !== 0) {
    return next(
      new AppError(
        "This ride cannot longer be closed. Ride must be available (status 0)"
      )
    );
  }
  if (ride.chosenRequest) {
    const request = await Request.findById(ride.chosenRequest);
    request.status = 3;
    request.save();
  }

  req.body.status = 3;
  req.body.chosenRequest = null;
  next();
});

export const completedRide = catchAsync(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);
  if (ride.status !== 1 || !ride.chosenRequest) {
    return next(
      new AppError(
        "This ride does not have a match, it cannot be marked as completed"
      )
    );
  }

  const request = await Request.findById(ride.chosenRequest);
  request.status = 5;
  request.save();

  req.body.status = 5;
  next();
});

export const getRidesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, latlngEnd, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const [latE, lngE] = latlngEnd.split(",");

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400
      )
    );
  }

  const radius = unit === "miles" ? distance / 3963.2 : distance / 6378.1;
  const rides = await Ride.find({
    pickUp: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    dropOff: { $geoWithin: { $centerSphere: [[lngE, latE], radius] } },
  });

  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: "success",
    results: rides.length,
    data: { data: rides },
  });
});

// export const deleteRide = deleteRide(Ride);
