import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createPickupSpot,
  deletePickupSpot,
  getUserPickupSpots,
  setPrimaryPickupSpot,
  updatePickupSpot,
} from "../controllers/pickupSpot.controller.js";

const pickupSpotRouter = Router();

pickupSpotRouter.use(auth);

pickupSpotRouter.post("/", createPickupSpot);
pickupSpotRouter.get("/", getUserPickupSpots);
pickupSpotRouter.put("/:pickupSpotId", updatePickupSpot);
pickupSpotRouter.delete("/:pickupSpotId", deletePickupSpot);
pickupSpotRouter.patch("/:pickupSpotId/primary", setPrimaryPickupSpot);

export default pickupSpotRouter;
