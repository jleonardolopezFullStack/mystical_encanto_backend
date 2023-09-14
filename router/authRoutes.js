const { Router } = require("express");
const {
  getUser,
  postUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/authController");
const { check } = require("express-validator");
const { generalResult } = require("../middlewears/validationResult");
const { existEmail } = require("../middlewears/validateExistEmail");
const { passwordValidator } = require("../middlewears/passwordValidation");
const { tokenVerification } = require("../middlewears/tokenVerification");

const authRouter = Router();

authRouter.get("/", [tokenVerification, generalResult], getUsers);
authRouter.get(
  "/:id",
  tokenVerification,
  check("id", "Please send valid ID").isMongoId(),
  getUser
);
authRouter.post(
  "/",
  [
    check("name", "The name have to be fill").not().isEmpty(),
    check("password", "The password have to be fill").not().isEmpty(),
    check("email", "It is not a right email, try again please").isEmail(),
    check("email", "The email exist already").custom(existEmail),
    generalResult,
  ],
  postUser
);
authRouter.put(
  "/:id",
  [
    tokenVerification,
    check("id", "Please send valid ID").isMongoId(),
    passwordValidator,
    generalResult,
  ],
  updateUser
);
authRouter.delete(
  "/:id",
  [
    tokenVerification,
    check("id", "Please send valid ID").isMongoId(),
    passwordValidator,
    generalResult,
  ],
  deleteUser
);

module.exports = authRouter;
