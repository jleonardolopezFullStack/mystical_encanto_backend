const User = require("../models/authSchema");

const existEmail = async (email = "") => {
  //console.log(email);
  const validateEmailExist = await User.findOne({ email });
  console.log(validateEmailExist);
  if (validateEmailExist) {
    throw new Error(
      `Something went wrong, check your credentials and try again -email`
    );
  }
};

module.exports = { existEmail };
