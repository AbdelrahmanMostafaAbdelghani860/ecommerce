import { nanoid } from "nanoid";
import cloudinary from "../../../utilies/cloud.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import productModel from "../../../../DB/models/Product.model.js";
import CategoryModel from "../../../../DB/models/category.model.js";

export const CreateProduct = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new Error("You have to upload images ", { cause: 400 }));
  }
  let images = [];
  const cloudFolder = nanoid();
  req.files.subimages.forEach(async (file) => {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_NAME}/product/ ${cloudFolder}` }
    );
    images.push({ url: secure_url, id: public_id });
  });
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.FOLDER_NAME}/product/ ${cloudFolder}` }
  );
  const product = await productModel.create({
    ...req.body,
    cloudFolder: cloudFolder,
    createdBy: req.user._id,
    defaultImage: { id: public_id, url: secure_url },
    images,
  });
  console.log(product.finalPrice);
  return res
    .status(201)
    .json({ message: "Product added sucessfully", results: product });
});
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.productId);

  if (!product) {
    return next(new Error("No product Found ! "));
  }
  if (product.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can delete the product "));
  }
  // delete images from cloudinary
  product.images.forEach(async (image) => {
    await cloudinary.uploader.destroy(image.id);
  });

  await cloudinary.uploader.destroy(product.defaultImage.id);

  const deleted = await productModel.deleteOne({ _id: req.params.productId });

  if (!deleted.deletedCount) {
    return next(new Error("Something Went Wrong ! ", { cause: 500 }));
  }
  // await cloudinary.api.delete_folder(
  //   `${process.env.FOLDER_NAME}/product/${product.cloudFolder}`
  // );
  return res.json({ sucess: true, message: "Deleted Sucessfully " });
});
// get all products
export const allProducts = asyncHandler(async (req, res, next) => {
  // const { keyword } = req.query;
  const products = await productModel.find();

  return res.json({ message: "All Products  ", result: products });
});
// single product

export const oneProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "Product result", results: product });
});
export const productCategory = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.categoryId);
  if (!category) {
    return next(new Error("No category Found", { cause: 404 }));
  }
  const product = await productModel
    .find({
      category: req.params.categoryId,
    })
    .paginate(req.query.page);

  if (!product) {
    return next(
      new Error("No products are found for this category ", { cause: 404 })
    );
  }
  return res.status(200).json({
    message: "Products are shown succesfully ",
    results: product,
  });
});
