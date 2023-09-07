import { Router } from "express";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utilies/multer.js";
import * as subCategoryController from "./controller/subcategory.js";
import isValid from "../../middleware/validation.middleware.js";
import * as validators from "./subcategory.validation.js";
const router = Router({ mergeParams: true });
// create subcategory
router.post(
  "/create",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subCategory"),
  isValid(validators.createSubCategory),
  subCategoryController.createSubCategory
);
// update subcategory
router.patch(
  "/update/:subcategoryid",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subCategory"),
  isValid(validators.updateCategory),
  subCategoryController.updatesubCategory
);
// delete subCategory
router.delete(
  "/delete/:subcategoryid",
  isAuthinticated,
  isAuthorized("admin"),
  subCategoryController.deleteSubCategory
);
// get all
router.get("/", subCategoryController.getAllSubcategories);
export default router;
