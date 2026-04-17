import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";

const addressRouter = Router();
addressRouter.use(auth);
addressRouter.post("/", createAddress);
addressRouter.get("/", getUserAddresses);
addressRouter.get("/:addressId", getAddressById);
addressRouter.put("/:addressId", updateAddress);
addressRouter.delete("/:addressId", deleteAddress);
addressRouter.patch("/:addressId/default", setDefaultAddress);

export default addressRouter;