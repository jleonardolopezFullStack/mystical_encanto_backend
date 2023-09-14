const bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../models/authSchema");

const secret = process.env.SECRET_KEY;
//const secret = "Este es el secret key";
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json("Your email is not in database");
    }
    const comparePassword = bcryptjs.compareSync(password, user.password);
    if (!comparePassword) {
      return res.json({
        msg: "Something goes wrong with your password, try again please",
      });
    }

    const token = jwt.sign(
      {
        user,
      },
      secret,
      { expiresIn: "1h" }
    );

    token
      ? res.json({ msg: "The user have been logged", token })
      : res.json({
          msg: "Something goes wrong with your Login, please try again",
        });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Login" });
  }
};

module.exports = { login };
