import mongoose, { Schema, Types, model } from "mongoose";

const subCategoryschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 4,
      max: 25,
    },
    slug: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    categoryId: {
      type: Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export const subcategoryModel =
  mongoose.models.subcategoryModel || model("subCategory", subCategoryschema);
