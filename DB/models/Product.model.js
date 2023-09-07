import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 20 },

    description: { type: String },

    soldItems: { type: Number, default: 0 },

    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },

    price: { type: Number, required: true },

    discount: { type: Number, max: 100, min: 1 },

    avaliableItems: { type: Number, required: true, min: 1 },

    createdBy: { type: Types.ObjectId, ref: "User", required: true },

    category: { type: Types.ObjectId, ref: "Category" },

    subCategory: { type: Types.ObjectId, ref: "subCategory" },

    cloudFolder: { type: String, unique: true },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
  }
);
// helper
productSchema.query.paginate = function (page) {
  // this
  const limit = 3;
  const skip = limit * (page - 1);
  // return
  if (page < 1 || isNaN(page) || !page) {
    return (page = 1);
  }
  return this.skip(skip).limit(limit);
};
productSchema.query.customselect = function (fields) {
  if (!fields) {
    return this;
  }
  const modelKey = productModel.schema.paths;
  const queryKeys = fields.split(" ");
  const matchedKeys = queryKeys.filter((key) => {
    modelKey.includes(key);
  });
  return this.select(matchedKeys);
};
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});
productSchema.methods.inStock = function (requiredQ) {
  return this.avaliableItems >= requiredQ ? true : false;
};
const productModel = model("Product", productSchema);

export default productModel;
