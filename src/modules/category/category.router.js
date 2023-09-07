import { Router } from "express";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import * as Validators from "./category.validation.js";
import isValid from "../../middleware/validation.middleware.js";
import * as categoryController from "./controller/category.js";
import { fileUpload, filterObject } from "../../utilies/multer.js";
import subCategoryRouter from "../subcategory/subcategory.router.js";
import productRouter from "../Product/product.router.js";
const router = Router();
router.use("/:categoryId/subcategory", subCategoryRouter);
router.use("/:categoryId/product", productRouter);
// create a category
router.post(
  "/create",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(Validators.CategoryValidation),
  categoryController.createCategory
);
// update
router.patch(
  "/update/:categoryid",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(Validators.updateCategory),
  categoryController.updateCategory
);
// delete
router.delete(
  "/delete/:categoryid",
  isAuthinticated,
  isAuthorized("admin"),
  isValid(Validators.deleteCategory),
  categoryController.deleteCategory
);
//get All categories
router.get("/all", categoryController.showCategory);
export default router;
