import express from "express";
import { protect, restrictTo } from "./../controllers/authController.js";
import { getAllRequests, createRequest, matchRideId ,updateRequests,deleteRequests} from "../controllers/requestsController.js";

const router = express.Router();

router
  .route("/:rideId")
  .get(matchRideId, getAllRequests)
  .post(matchRideId, createRequest)
  .patch(protect, updateRequests)
  .delete(protect, deleteRequests);

export default router;
