const { request, response, next } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/authSchema");

const passwordValidator = async (req = request, res = response, next) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    if (password) {
      const user = await User.findById(id);

      if (!user) {
        return res.json({
          msg: "The ID is wrong, can you check and try again",
        });
      }
      const comparePassword = bcryptjs.compareSync(password, user.password);
      if (!comparePassword) {
        return res.json({
          msg: "Something goes wrong with your password, try again please",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
  next();
};

module.exports = { passwordValidator };
