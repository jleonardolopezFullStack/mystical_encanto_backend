const { Router } = require("express");
const { check } = require("express-validator");
const { tokenVerification } = require("../middlewears/tokenVerification");
const { generalResult } = require("../middlewears/validationResult");

const {
  mainpageGet,
  mainpagePost,
  mainpagePut,
  mainpageDelete,
} = require("../controllers/mainpageController");

const mainpageRouter = Router();

mainpageRouter.get("/", /* [tokenVerification, generalResult], */ mainpageGet);

mainpageRouter.post(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    check("color", "The name have to be fill").not().isEmpty(),
    check("urlCloudinary", "The urlCLoudinary have to be fill").not().isEmpty(),
    check("idCloudinary", "The idCloudinary have to be fill").not().isEmpty(),
    generalResult,
  ],
  mainpagePost
);

mainpageRouter.put(
  "/:id",
  /*  "/:token", */
  [
    tokenVerification,
    check("id", "Please send valid ID").isMongoId(),
    generalResult,
  ],
  mainpagePut
);

mainpageRouter.delete(
  "/:idCloudinary",
  /*  "/:token", */
  [
    tokenVerification,
    /*     check("id", "Please send valid ID").isMongoId(), */
    /*     check("urlCloudinary", "The urlCLoudinary have to be fill").not().isEmpty(), */
    generalResult,
  ],
  mainpageDelete
);

module.exports = mainpageRouter;
