import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        _id: false,
        quantity: {
          type: Number,
          default: 1,
        },
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = model("Cart", cartSchema);
export default CartModel;
