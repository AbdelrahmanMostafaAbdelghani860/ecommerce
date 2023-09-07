import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        productId: {
          _id: false,
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    user: { type: Types.ObjectId, ref: "User" },
    invoice: { id: String, url: String },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coupon: {
      couponId: { type: Types.ObjectId, ref: "Coupon" },
      code: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      enum: ["Placed", "Shipped", "Deleiverd", "Canceled", "refunded"],
      default: "Placed",
    },
    price: {
      type: Number,
      required: true,
    },
    Payment: {
      type: String,
      enum: ["visa", "cash"],
      default: "cash",
    },
  },
  { timestamps: true }
);
orderSchema.virtual("orderfinalPrice").get(function () {
  return this.coupon
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount || 0) / 100
      ).toFixed(2)
    : this.price;
});
const orderModel = model("Order", orderSchema);
export default orderModel;
