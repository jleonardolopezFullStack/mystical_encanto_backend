const { Router } = require("express");
const { check } = require("express-validator");
const { tokenVerification } = require("../middlewears/tokenVerification");
const { generalResult } = require("../middlewears/validationResult");
const {
  galleryPost,
  galleryGet,
  galleryDelete,
} = require("../controllers/galleryController");

const galleryRouter = Router();

galleryRouter.get("/", /* [tokenVerification, generalResult], */ galleryGet);

galleryRouter.post(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    //check("image", "The image have to be fill").not().isEmpty(),
    generalResult,
  ],
  galleryPost
);

galleryRouter.delete(
  "/:idCloudinary",
  [
    tokenVerification,
    /* check("urlCloudinary", "The name have to be fill").not().isEmpty(), */
    generalResult,
  ],
  galleryDelete
);

module.exports = galleryRouter;
