const { Router } = require("express");
const { check } = require("express-validator");
const { tokenVerification } = require("../middlewears/tokenVerification");
const { generalResult } = require("../middlewears/validationResult");
const {
  informationPost,
  informationGet,
  informationPut,
  informationDelete,
} = require("../controllers/informationController");

const informationRouter = Router();

informationRouter.get(
  "/",
  /* [tokenVerification, generalResult], */ informationGet
);

informationRouter.post(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    check("description", "The Description have to be fill").not().isEmpty(),
    check("items", "Items have to be fill").not().isEmpty(),
    generalResult,
  ],
  informationPost
);

informationRouter.put(
  "/",

  [
    tokenVerification,
    /* check("id", "Please send valid ID").isMongoId(), */
    generalResult,
  ],
  informationPut
);

informationRouter.delete(
  "/",

  [
    tokenVerification,
    check("id", "Please send valid ID").isMongoId(),
    check("idCloudinary", "idCloudinary have to be fill").not().isEmpty(),
    generalResult,
  ],
  informationDelete
);

module.exports = informationRouter;
