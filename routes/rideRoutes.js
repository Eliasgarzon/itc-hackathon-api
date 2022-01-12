import express from "express";
import {
  createRide,
  getAllRides,
  getRide,
  updateRide,
} from "../controllers/rideController.js";
import { protect, restrictTo } from "./../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllRides).post(createRide).patch(updateRide);
router.route("/:id").get(getRide);

export default router;
