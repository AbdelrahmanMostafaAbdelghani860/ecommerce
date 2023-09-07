import { Router } from "express";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isValid from "../../middleware/validation.middleware.js";
import * as validators from "./order.validation.js";
import * as controllers from "./controller/order.js";
const router = Router();
// create order
router.post(
  "/create",
  isAuthinticated,
  isValid(validators.createOrderSchema),
  controllers.createOrder
);
// cancel order
router.patch(
  "/:orderId",
  isAuthinticated,
  isValid(validators.deleteOrderSchema),
  controllers.cancelOrder
);
export default router;
