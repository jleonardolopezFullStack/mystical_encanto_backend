const { Schema, model } = require("mongoose");

const gallerySchema = new Schema({
  urlCloudinary: {
    type: String,
    required: [true, "Please add the url from clodinary app"],
  },
  idCloudinary: {
    type: String,
    required: [true, "Please add the url from clodinary app"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Gallery", gallerySchema);
