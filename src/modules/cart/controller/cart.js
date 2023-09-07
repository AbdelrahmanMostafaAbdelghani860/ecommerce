import productModel from "../../../../DB/models/Product.model.js";
import CartModel from "../../../../DB/models/cart.model.js";
import asyncHandler from "../../../utilies/errorHandler.js";
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  // Check Stock
  if (!product.inStock(quantity)) {
    return next(
      new Error(
        `Only ${product.avaliableItems} items are available. Please change your quantity.`
      )
    );
  }

  // Find the Cart of user
  const cart = await CartModel.findOne({ user: req.user._id });
  // Add Products to Cart
  cart.products.push({ productId, quantity });
  await cart.save();

  return res.json({ message: "Added successfully", results: cart });
});
export const getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.find({ user: req.user._id }).populate({
    path: "products.productId",
    select: "name price discount finalPrice description ",
  });
  if (!cart) {
    return next(new Error("no cart found "));
  }
  return res.json({ message: "Added Sucessfully", results: cart });
});
export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product can not be found ", { cause: 404 }));
  }
  if (quantity > product.avaliableItems) {
    return next(
      new Error(
        `only ${product.avaliableItems} items are avaliable , Please change your quantity`
      )
    );
  }
  //   let products = [];
  //   products.push({ productId, quantity });
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );

  return res.json({ message: "Updated Sucessfully", results: cart });
});
export const removeProduct = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        products: { productId: req.params.productId },
      },
    },
    { new: true }
  );
  return res.json({ message: "Updated Sucessfully", results: cart });
});
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      products: [],
    }
  );
  return res.json({
    message: " your Cart cleared successfully",
    sucess: true,
    results: cart.products.length ? "Filled" : "Empty",
  });
});
