const { Schema, model } = require("mongoose");

const mainpageSchema = new Schema({
  color: {
    type: String,
    required: [
      true,
      "Please places the representative color in hexagonal format",
    ],
  },
  idCloudinary: {
    type: String,
    required: [true, "Please add the id from clodinary app"],
  },
  urlCloudinary: {
    type: String,
    required: [true, "Please add the url from clodinary app"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Mainpage", mainpageSchema);
