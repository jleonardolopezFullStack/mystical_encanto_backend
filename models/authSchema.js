const { Schema, model } = require("mongoose");

const authSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: [true, "Please type your email Dude-From Schema"],
    },
    password: {
      type: String,
      required: [true, "Please type your email Dude-From Schema"],
    },
    state: { type: Boolean, default: true },
    rol: {
      type: String,
      enum: ["ADMIN_ROLE", "USER_ROLE"],
      default: "ADMIN_ROLE",
    },
  },
  { timestamps: true, versionKey: false }
);

authSchema.methods.toJSON = function (params) {
  const { password, ...usuario } = this.toObject();
  //usuario.uid = _id;
  return usuario;
};
module.exports = model("User", authSchema);
