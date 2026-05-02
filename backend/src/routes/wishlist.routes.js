import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
  toggleWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();
router.use(auth);
router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);
router.post("/toggle", toggleWishlist);
router.get("/check/:productId", isInWishlist);

export default router;
