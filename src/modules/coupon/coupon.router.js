import { Router } from "express";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import * as validators from "./coupon.validation.js";
import isValid from "../../middleware/validation.middleware.js";
import * as couponController from "./controller/coupon.js";
const router = Router();
//create
router.post(
  "/create",
  isAuthinticated,
  isAuthorized("admin"),
  isValid(validators.createCouponSchema),
  couponController.createCoupon
);
//update
router.patch(
  "/update/:code",
  isAuthinticated,
  isAuthorized("admin"),
  isValid(validators.updateCouponSchema),
  couponController.updateCoupon
);
//delete
router.delete(
  "/delete/:code",
  isAuthinticated,
  isAuthorized("admin"),
  isValid(validators.deleteSchema),
  couponController.deleteCoupon
);
// get admin valid coupons
router.get(
  "/usercoupons",
  isAuthinticated,
  isAuthorized("admin"),
  couponController.getAdminCoupon
);
// get all coupons with explicity of id
router.get("/", couponController.allCoupons);
export default router;
