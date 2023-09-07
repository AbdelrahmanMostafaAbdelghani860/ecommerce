import CategoryModel from "../../../../DB/models/category.model.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import cloudinary from "../../../utilies/cloud.js";
import slugify from "slugify";
import { subcategoryModel } from "../../../../DB/models/subCategory.model.js";
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!req.file) {
    return next(
      new Error("Please Upload an image for category!", { cause: 404 })
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_NAME}/category/${slugify(name)}` }
  );
  const category = await CategoryModel.create({
    name: name,
    createdBy: req.user.id,
    slug: slugify(req.body.name),
    image: {
      id: public_id,
      url: secure_url,
    },
  });
  return (await category.save())
    ? res.json({ success: true, message: "Category Added succesfully" })
    : next(new Error("Something Went Wrong!"));
});
export const updateCategory = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const { categoryid } = req.params;

  if (!user) {
    return next(new Error("The user is not found"));
  }

  const category = await CategoryModel.findById(categoryid);
  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }
  if (category.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can update the category "));
  }
  // update name and slug if exist
  category.name = req.body.name ? req.body.name : category.name;
  // slug
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;

  // file
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image.public_id,
        secure_url: category.image.url,
      }
    );
    // Update the category's image URL in the database

    category.image.url = secure_url;
    category.image.id = public_id;
  }
  await category.save();
  return res.json({ message: "updated Sucessfully", success: true });
});
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.categoryid);
  if (!category) {
    return next(new Error("Category not found ", { cause: 404 }));
  }
  if (category.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can update the category "));
  }
  const subcategories = await subcategoryModel.find({
    categoryId: category.id,
  });
  // Delete Categories photo
  const resultImage = await cloudinary.uploader.destroy(category.image.id);
  // Delete Images for subCategories as well

  const resultsubcategories = subcategories.forEach(async (subcategory) => {
    await cloudinary.uploader.destroy(subcategory.image.id);
  });
  // Check results have been deleted
  if (!resultImage || resultsubcategories) {
    return next(new Error("Images can not be deleted "));
  }
  // Delete Sub categories first
  await subcategoryModel.deleteMany({
    categoryId: category.id,
  });
  // Delete the category
  await category.deleteOne({ id: category.id });
  return res.json({
    success: true,
    message: "Category and it's subcategories has been deleted ! ",
  });
});
export const showCategory = asyncHandler(async (req, res, next) => {
  const allCategories = await CategoryModel.find().populate({
    path: "Subcategory",
    select: "name",
  });
  if (!allCategories) {
    return next(new Error("No categories to show "));
  }

  return res
    .status(200)
    .json({ message: "All categories", success: true, results: allCategories });
});
