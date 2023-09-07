import { Router } from "express";
import isValid from "../../middleware/validation.middleware.js";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import * as validators from "./product.validation.js";
import { fileUpload, filterObject } from "../../utilies/multer.js";
import * as productController from "./Controller/product.js";

const router = Router({ mergeParams: true });
// create
router.post(
  "/create",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subimages", maxCount: 4 },
  ]),
  isValid(validators.createProduct),
  productController.CreateProduct
);
// delete
router.delete(
  "/delete/:productId",
  isAuthinticated,
  isAuthorized("admin"),
  isValid(validators.productidSchema),
  productController.deleteProduct
);
// All Products
router.get("/all", productController.allProducts);
// one product
router.get(
  "/:productId",
  isValid(validators.productidSchema),
  productController.oneProduct
);
// all product related to specific category
router.get(
  "/",
  isValid(validators.categoryidSchema),
  productController.productCategory
);
export default router;
