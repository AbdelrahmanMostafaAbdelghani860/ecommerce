import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 20,
      min: 3,
      unique: true,
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
    brand: { type: Types.ObjectId, ref: "brand" },
  },

  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
categorySchema.virtual("Subcategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "categoryId",
});

const CategoryModel = model("Category", categorySchema);
export default CategoryModel;
