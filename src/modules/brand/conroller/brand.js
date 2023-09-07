import brandModel from "../../../../DB/models/brand.model.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import cloudinary from "../../../utilies/cloud.js";
import slugify from "slugify";
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!req.file) {
    return next(new Error("Please Upload an image for Brand!", { cause: 404 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_NAME}/brand/${slugify(name)}` }
  );
  const brand = await brandModel.create({
    name: name,
    createdBy: req.user.id,
    slug: slugify(req.body.name),
    image: {
      id: public_id,
      url: secure_url,
    },
  });
  return (await brand.save())
    ? res.json({
        success: true,
        message: "Brand Added succesfully",
        results: brand,
      })
    : next(new Error("Something Went Wrong!"));
});
export const updateBrand = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const { brandid } = req.params;

  if (!user) {
    return next(new Error("The user is not found"));
  }

  const brand = await brandModel.findById(brandid);
  if (!brand) {
    return next(new Error("brand not found", { cause: 404 }));
  }
  if (brand.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can update the brand "));
  }
  // update name and slug if exist
  brand.name = req.body.name ? req.body.name : brand.name;
  // slug
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

  // file
  if (req.file) {
    // Delete previous image from Cloudinary
    await cloudinary.uploader.destroy(brand.image.id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.FOLDER_NAME}/brand/${slugify(brand.name)}`, // Use updated brand name for the folder
      }
    );
    // Update the brand's image URL and ID in the database
    brand.image.url = secure_url;
    brand.image.id = public_id;

    // Delete the old folder from Cloudinary
    // const oldFolder = `${process.env.FOLDER_NAME}/brand/${slugify(brand.name)}`;
    // await cloudinary.api.delete_folder(oldFolder, { resource_type: "auto" });
  }

  await brand.save();
  return res.json({
    message: "updated Successfully",
    success: true,
    results: brand,
  });
});
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.brandid);
  if (!brand) {
    return next(new Error("Brand not found ", { cause: 404 }));
  }
  if (brand.createdBy.toString() !== req.user.id) {
    return next(new Error("only creator can update the brand "));
  }
  const resultImage = await cloudinary.uploader.destroy(brand.image.id);
  await brand.deleteOne({ id: brand.id });
  return res.json({
    success: true,
    message: "brand has been deleted ! ",
    image: resultImage,
  });
});
export const showBrand = asyncHandler(async (req, res, next) => {
  const allBrands = await brandModel.find();
  if (!allBrands) {
    return next(new Error("No Brands to show "));
  }

  return res
    .status(200)
    .json({ message: "All Brands", success: true, results: allBrands });
});
