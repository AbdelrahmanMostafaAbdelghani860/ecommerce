import { Router } from "express";
import * as validators from "./brand.validation.js";
import isValid from "../../middleware/validation.middleware.js";
import isAuthinticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utilies/multer.js";
import * as brandController from "./conroller/brand.js";
const router = Router();
// Create
router.post(
  "/Create",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(validators.brandValidation),
  brandController.createBrand
);
// update
router.patch(
  "/update/:brandid",
  isAuthinticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(validators.updatebrand),
  brandController.updateBrand
);
// delete
router.delete(
  "/delete/:brandid",
  isAuthinticated,
  isAuthorized("admin"),
  isValid(validators.deletebrand),
  brandController.deleteBrand
);
//get All categories
router.get("/all", brandController.showBrand);

export default router;
