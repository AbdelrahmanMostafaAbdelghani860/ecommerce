import { fileURLToPath } from "url";
import productModel from "../../../../DB/models/Product.model.js";
import CartModel from "../../../../DB/models/cart.model.js";
import couponModel from "../../../../DB/models/coupon.model.js";
import orderModel from "../../../../DB/models/order.model.js";
import userModel from "../../../../DB/models/user.model.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import { createInvoice } from "../../../utilies/generateInvoice.js";
import path from "path";
import cloudinary from "../../../utilies/cloud.js";
import { sendeMail } from "../../../utilies/email.js";
import { clearCart, updateStock } from "./order.services.js";
import { nanoid } from "nanoid";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const createOrder = asyncHandler(async (req, res, next) => {
  // data
  const { Payment, address, phone, coupon } = req.body;
  // check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await couponModel.findOne({
      code: coupon,
      expiredAt: { $gt: Date.now() },
    });
  }
  // check cart
  const cart = await CartModel.findOne({ user: req.user.id });
  let orderProduct = [];
  let orderPrice = 0;
  const products = cart.products;
  if (products.length < 1) {
    return next(new Error("Yourr cart is emty"));
  }
  for (let i = 0; i < products.length; i++) {
    // check product existence
    const product = await productModel.findById(products[i].productId);
    if (!product) {
      return next(new Error("No product Found "));
    }
    if (!product.inStock(products[i].quantity)) {
      return next(new Error("avaliable amount of products are not enough"));
    }
    orderProduct.push({
      productId: product.id,
      quantity: products[i].quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });
    orderPrice += product.finalPrice * products[i].quantity;
  }
  const order = await orderModel.create({
    products: orderProduct,
    price: orderPrice,
    address,
    phone,
    Payment,
    coupon: {
      id: checkCoupon?._id,
      code: checkCoupon?.code,
      discount: checkCoupon?.discount,
    },
    user: req.user.id,
  });
  const user = await userModel.findById(req.user.id);
  //   generate pdf
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    subtotal: parseInt(order.price),
    paid: parseInt(order.orderfinalPrice),
    invoice_nr: order.id,
    items: order.products,
  };
  //   const pdfPath = path.join(
  //     __dirname,
  //     `./../../../InvoiceTemp/${order.id}.pdf`
  //   );
  const pdfPath = path.join(
    __dirname,
    "../../../../InvoiceTemp",
    `${user.userName}+${nanoid()}.pdf`
  );
  if (
    typeof invoice.paid !== "number" ||
    typeof invoice.subtotal !== "number"
  ) {
    console.error("invoice.paid and invoice.subtotal must be numbers");
    return; // Don't call createInvoice
  }
  let paid = parseInt(invoice.paid, 10);
  if (isNaN(paid)) {
    console.error("invoice.paid cannot be parsed into a number:", invoice.paid);
    return; // Don't call createInvoice
  }

  let subtotal = parseInt(invoice.subtotal, 10);
  if (isNaN(subtotal)) {
    console.error(
      "invoice.subtotal cannot be parsed into a number:",
      invoice.subtotal
    );
    return; // Don't call createInvoice
  }
  createInvoice(invoice, pdfPath);
  // upload pdf in cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.FOLDER_NAME}/Orders/${user.userName}/${invoice.invoice_nr}.pdf}`,
  });
  // check stock
  order.invoice = {
    id: public_id,
    url: secure_url,
  };
  order.save();
  // send email with invoice
  const sentanEmail = await sendeMail({
    to: user.email,
    subject: "Invoive Check",
    attachments: {
      path: secure_url,
      contentType: "application/pdf",
    },
  });
  // remove items from avaliable and increase the sold

  if (sentanEmail) {
    clearCart(req.user.id);
    updateStock(order.products, true);
  }
  // payment with Visa
  if (order.Payment === "visa") {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    let existCoupon;
    if (order.coupon.code !== undefined) {
      existCoupon = await stripe.coupons.create({
        duration: "once",
        percent_off: order.coupon.discount,
      });
    }
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        success_url: "http://localhost",
        cancel_url: "http://localhost/3000",
        mode: "payment",
        line_items: order.products.map((product) => {
          return {
            price_data: {
              currency: "EGP",
              product_data: {
                name: product.name,
              },
              unit_amount: product.itemPrice * 100,
            },
            quantity: product.quantity,
          };
        }),
        discounts: existCoupon ? [{ coupon: existCoupon.id }] : [],
      }
      // console.log(existCoupon)
    );
    return res.status(201).json({
      message: "Go to Checkout",
      sucess: true,
      result: session.url,
    });
  }
  // Send a response
  return res.json({
    message: "Order Placed Successfully",
    results: order,
    sucess: true,
  });
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(req.params.orderId);
  if (!order) {
    return next(new Error("order not found", { cause: 404 }));
  }
  if (order.status === "Shipped" || order.status === "Deleiverd") {
    return next(new Error("This order can not be canceled "));
  }
  order.status = "Canceled";
  updateStock(order.products, false);

  await order.save();

  return res
    .status(201)
    .json({ message: "cancelled Sucessfully", sucess: true });
});
