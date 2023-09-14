const { Schema, model } = require("mongoose");

const colorNavbar = new Schema({
  color1: String,
  color2: String,
});
const colorDashboard = new Schema({
  color1: String,
  color2: String,
});
const colorProduct = new Schema({
  color1: String,
  color2: String,
});
const colorGallery = new Schema({
  color1: String,
  color2: String,
});
const colorCart = new Schema({
  color1: String,
  color2: String,
});
const colorLetters = new Schema({
  color1: String,
  color2: String,
});

const colorsSchema = new Schema({
  colorNavbar: colorNavbar,
  colorDashboard: colorDashboard,
  colorProduct: colorProduct,
  colorGallery: colorGallery,
  colorCart: colorCart,
  colorLetters: colorLetters,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Colors", colorsSchema);
