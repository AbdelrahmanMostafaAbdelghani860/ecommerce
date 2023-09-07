import slugify from "slugify";
import { subcategoryModel } from "../../../../DB/models/subCategory.model.js";
import cloudinary from "../../../utilies/cloud.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import CategoryModel from "../../../../DB/models/category.model.js";

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;
  const { categoryId } = req.params;
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("category not found ", { cause: 404 }));
  }
  if (!req.file) {
    return next(
      new Error("Please Upload an image for Subcategory!", { cause: 404 })
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_NAME}/category/${
        category.slug
      }/subcategories/${slugify(name)}`,
    }
  );
  const subCategory = await subcategoryModel.create({
    name: name,
    createdBy: userId,
    slug: slugify(req.body.name),
    image: {
      id: public_id,
      url: secure_url,
    },
    categoryId,
  });
  return (await subCategory.save())
    ? res.json({
        success: true,
        message: "Subcategory Added succesfully",
        results: subCategory,
      })
    : next(new Error("Something Went Wrong!"));
});
export const updatesubCategory = asyncHandler(async (req, res, next) => {
  //   const { categoryId, subCategoryid } = req.params;
  const category = await CategoryModel.findById(req.params.categoryId);

  if (!category) {
    return next(new Error("Category is not found ", { cause: 404 }));
  }
  const subCategory = await subcategoryModel.findById(req.params.subcategoryid);
  console.log(subCategory);
  if (!subCategory) {
    return next(new Error("subCategory is not found ", { cause: 404 }));
  }
  if (subCategory.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can update the subcategory "));
  }
  subCategory.name = req.body.name ? req.body.name : subCategory.name;

  subCategory.slug = req.body.name ? slugify(req.body.name) : subCategory.slug;

  // file uploaded
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subCategory.image.id,
        secure_url: subCategory.image.url,
      }
    );
    subCategory.image.url = secure_url;

    subCategory.image.id = public_id;
  }

  await subCategory.save();

  return res.status(201).json({
    message: "updated Sucessfully",
    results: subCategory,
    success: true,
  });
});
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.categoryId);
  if (!category) {
    return next(new Error("Category is not found ", { cause: 404 }));
  }

  const subCategory = await subcategoryModel.findById(req.params.subcategoryid);
  if (!subCategory) {
    return next(
      new Error("Subcategory is already deleted or unfound", { cause: 404 })
    );
  }
  if (subCategory.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can delete  "));
  }
  const deleteSubCategory = await subcategoryModel.deleteOne(subCategory);
  if (!deleteSubCategory.deletedCount) {
    return next(new Error("Something Went Wrong!", { cause: 500 }));
  }
  return res.json({
    success: true,
    message: "Deleted Sucessfully",
    results: deleteSubCategory,
  });
});
export const getAllSubcategories = asyncHandler(async (req, res, next) => {
  const subcategories = await subcategoryModel
    .find()
    .populate({ path: "categoryId", select: "name" });
  return res.json({ message: "Done", results: subcategories });
});
