import express from "express";
import {
  closeRide,
  completedRide,
  createRide,
  filterMyRides,
  getAllRides,
  getRide,
  getRidesWithin,
  rideDefaults,
  updateRide,
} from "../controllers/rideController.js";
import { protect, restrictTo } from "./../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllRides).post(rideDefaults, createRide);
router.route("/myrides").get(filterMyRides, getAllRides);
router
  .route("/:id")
  .get(getRide)
  .patch(updateRide)
  .delete(closeRide, updateRide);

router.route("/:id/completed").patch(completedRide, updateRide);

//latlng is like this center/34.094,24.57/unit...
router
  .route("/rides-within/:distance/center/:latlng/end/:latlngEnd/unit/:unit")
  .get(getRidesWithin);
export default router;
