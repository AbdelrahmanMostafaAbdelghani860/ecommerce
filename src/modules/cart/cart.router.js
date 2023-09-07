import { Router } from "express";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isValid from "../../middleware/validation.middleware.js";
import * as validators from "./cart.validation.js";
import * as cartController from "./controller/cart.js";
const router = Router();
router.post(
  "/add",
  isAuthinticated,
  isValid(validators.CartSchema),
  cartController.addToCart
);
router.get("/usercart", isAuthinticated, cartController.getUserCart);
router.patch(
  "/update",
  isAuthinticated,
  isValid(validators.CartSchema),
  cartController.updateCart
);
router.patch(
  "/:productId",
  isAuthinticated,
  isValid(validators.removeProduct),
  cartController.removeProduct
);
router.patch("/clear/cart", isAuthinticated, cartController.clearCart);
export default router;
