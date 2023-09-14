const { Schema, model } = require("mongoose");

const informationSchema = new Schema({
  description: {
    type: String,
    required: [true, "Please places a description of your product"],
  },
  items: {
    type: [String],
    required: [true, "Please add all items in the Bundle"],
  },
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

module.exports = model("Information", informationSchema);
