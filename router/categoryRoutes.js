const { Router } = require("express");
const { check } = require("express-validator");
const {
  categoryGet,
  categoryGetOne,
  categoryPost,
  categoryDelete,
  categoryUpdate,
} = require("../controllers/categoryController");
const { validateExistEmail } = require("../helpers/db_validation");
const { passwordValidator } = require("../middlewears/passwordValidation");
const { tokenVerification } = require("../middlewears/tokenVerification");
const { generalResult } = require("../middlewears/validationResult");

const categoryRouter = Router();

categoryRouter.get("/", /* [tokenVerification, generalResult], */ categoryGet);

categoryRouter.get(
  "/:name",
  [
    /* tokenVerification, */
    check("name", "The name have to be fill").not().isEmpty(),
    generalResult,
  ],
  categoryGetOne
);

categoryRouter.post(
  "/",
  /*   "/:token", */
  [
    tokenVerification,
    check("name", "The name have to be fill").not().isEmpty(),
    check("color1", "The name have to be fill").not().isEmpty(),
    check("color2", "The name have to be fill").not().isEmpty(),
    generalResult,
  ],
  categoryPost
);

categoryRouter.put(
  "/:id",
  /* "/:name/:token", */
  [
    tokenVerification,
    check("name", "The name have to be fill"),
    check("state", "The name have to be fill"),
    check("id", "Please send valid ID").isMongoId(),
    generalResult,
  ],
  categoryUpdate
);

categoryRouter.delete(
  "/:name",
  /* "/:name/:token", */
  [
    tokenVerification,
    check("name", "The name have to be fill").not().isEmpty(),
    generalResult,
  ],
  categoryDelete
);

module.exports = categoryRouter;
