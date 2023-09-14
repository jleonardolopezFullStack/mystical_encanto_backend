const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please type the product name Dude-From Schema"],
    uppercase: true,
    unique: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  state: { type: Boolean, default: true },
  variant: {
    type: String,
    required: [true, "Please type de size from Schema"],
  },
  quantityImg: {
    type: Number,
    required: [true, "Please type de size from Schema"],
  },
  quantity: {
    type: Number,
    required: [true, "Please type de size from Schema"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Please add the price of the pack Schema"],
  },
  discount: {
    type: Number,
  },
  color: {
    type: String,
    required: [
      true,
      "Please places the representative color in hexagonal format",
    ],
  },
  idStripe: {
    type: String,
    required: [true, "Please add the id from stripe app"],
  },
  idCloudinary: {
    type: [String],
    required: [true, "Please add the id from clodinary app"],
  },
  urlCloudinary: {
    type: [String],
    required: [true, "Please add the url from clodinary app"],
  },
});

module.exports = model("Product", productSchema);
