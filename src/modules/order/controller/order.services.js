import productModel from "../../../../DB/models/Product.model.js";
import CartModel from "../../../../DB/models/cart.model.js";

export const clearCart = async (userId) => {
  await CartModel.findOneAndUpdate({ user: userId }, { products: [] });
};

export const updateStock = async (products, status) => {
  if (status) {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: {
          avaliableItems: -product.quantity,
          soldItems: product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: {
          avaliableItems: product.quantity,
          soldItems: -product.quantity,
        },
      });
    }
  }
};
