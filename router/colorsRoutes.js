const { Router } = require("express");
const { check } = require("express-validator");
const { tokenVerification } = require("../middlewears/tokenVerification");
const { generalResult } = require("../middlewears/validationResult");
const {
  colorsGet,
  colorsPost,
  colorsPut,
  colorsDelete,
} = require("../controllers/colorsController");

const colorsRouter = Router();

colorsRouter.get("/", /* [tokenVerification, generalResult], */ colorsGet);

colorsRouter.post(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    check("colorNavbar", "The colorNavbar have to be fill").not().isEmpty(),
    check("colorDashboard", "The colorDashboard have to be fill")
      .not()
      .isEmpty(),
    check("colorProduct", "The colorProduct have to be fill").not().isEmpty(),
    check("colorGallery", "The colorGallery have to be fill").not().isEmpty(),
    check("colorCart", "The colorCart have to be fill").not().isEmpty(),
    check("colorLetters", "The colorLetters have to be fill").not().isEmpty(),

    generalResult,
  ],
  colorsPost
);

colorsRouter.put(
  "/:id",

  [
    tokenVerification,
    check("id", "Please send valid ID").isMongoId(),
    generalResult,
  ],
  colorsPut
);

/* colorsRouter.delete(
  "/",

  [
    tokenVerification,
    check("id", "Please send valid ID").isMongoId(),
    check("idCloudinary", "idCloudinary have to be fill").not().isEmpty(),
    generalResult,
  ],
  colorsDelete
); */

module.exports = colorsRouter;
