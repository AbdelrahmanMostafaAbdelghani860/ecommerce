import DBconnection from "../DB/connection.js";
import userRouter from "./modules/user/user.router.js";
import authRouter from "./modules/auth/auth.router.js";
import categoryRouter from "./modules/category/category.router.js";
import subCategoryRouter from "./modules/subcategory/subcategory.router.js";
import brandController from "./modules/brand/brand.router.js";
import productController from "./modules/Product/product.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import morgan from "morgan";
import orderRouter from "./modules/order/order.router.js";
const bootstrap = (app, express) => {
  // global middleware
  app.use(morgan("production"));
  app.use(express.json());
  // Routes

  // auth
  app.use("/auth", authRouter);
  // user
  app.use("/user", userRouter);
  // brand
  app.use("/brand", brandController);
  // Product router
  app.use("/product", productController);
  // coupon router
  app.use("/coupon", couponRouter);
  // cart router
  app.use("/cart", cartRouter);
  // category router
  app.use("/category", categoryRouter);
  // subcategory
  app.use("/subcategory", subCategoryRouter);
  // order
  app.use("/order", orderRouter);
  //   DataBase connection
  DBconnection();

  //   global error handler
  app.use((error, req, res, next) => {
    return res.json({
      sucess: false,
      message: error.message,
      stack: error.stack,
    });
  });
  app.all("*", (req, res, next) => {
    return res.json({ message: "Invalid Routing" });
  });
};

export default bootstrap;
