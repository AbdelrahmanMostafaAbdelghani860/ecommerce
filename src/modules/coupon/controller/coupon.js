import couponModel from "../../../../DB/models/coupon.model.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import voucher_codes from "voucher-code-generator";
export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucher_codes.generate({ length: 6 });

  const coupon = await couponModel.create({
    code: code[0],
    expiredAt: new Date(req.body.expiredAt).getTime(),
    createdBy: req.user.id,
    discount: req.body.discount,
  });
  return res
    .status(201)
    .json({ message: " Created Successfully", results: coupon });
});
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    code: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(
      new Error(" Coupon is out of date or not found", { cause: 404 })
    );
  }
  if (!coupon.createdBy == req.user.id.toString()) {
    return next(new Error("Only creator can edit"), { cause: 403 });
  }
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt)
    : coupon.expiredAt;
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.save();
  return res.json({ message: "Updated Sucessfully" });
});
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    code: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(
      new Error(" Coupon is out of date or not found", { cause: 404 })
    );
  }
  if (!coupon.createdBy == req.user.id.toString()) {
    return next(new Error("Only creator can edit"), { cause: 403 });
  }
  const deletedCoupon = await couponModel.deleteOne({ code: req.params.code });

  return deletedCoupon.deletedCount
    ? res.json({ message: "Deleted Sucessfully" })
    : next(new Error("Something went wrong!", { cause: 500 }));
});
export const getAdminCoupon = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find({
    createdBy: req.user.id,
    expiredAt: { $gt: Date.now() },
  });
  return res.json({ message: "Your Valid Coupons", results: coupons });
});
export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find().select("code expiredAt -_id");
  return res.json({ message: "All Coupons", results: coupons });
});
