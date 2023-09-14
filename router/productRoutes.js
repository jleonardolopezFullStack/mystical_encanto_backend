const { Router } = require("express");
const { check } = require("express-validator");
const {
  productGet,
  productGetOne,
  productPost,
  productDelete,
  productPut,
  productDeleteImageUpdate,
  productAddImageUpdate,
} = require("../controllers/productController");
const { tokenVerification } = require("../middlewears/tokenVerification");
const { generalResult } = require("../middlewears/validationResult");

const productRouter = Router();

productRouter.get("/", /* [tokenVerification, generalResult], */ productGet);

productRouter.get(
  "/:name",
  [
    /* tokenVerification, */
    check("name", "The name have to be fill").not().isEmpty(),
    generalResult,
  ],
  productGetOne
);

productRouter.post(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    check("name", "The name have to be fill").not().isEmpty(),
    check("category", "The category have to be fill").not().isEmpty(),
    check("variant", "The variant have to be fill").not().isEmpty(),
    check("quantityImg", "The quantityImg have to be fill").not().isEmpty(),
    check("quantity", "The quantity have to be fill").not().isEmpty(),
    check("price", "The price have to be fill").not().isEmpty(),
    check("discount", "The discount have to be fill").not().isEmpty(),
    check("color", "The color have to be fill").not().isEmpty(),
    check("idStripe", "The idStripe have to be fill").not().isEmpty(),
    generalResult,
  ],
  productPost
);

productRouter.put(
  "/:id",
  /*  "/:token", */
  [
    tokenVerification,
    //check("name", "The name have to be fill").not().isEmpty(),
    //check("newName", "The newName have to be fill").not().isEmpty(),
    //check("variant", "The variant have to be fill").not().isEmpty(),
    //check("quantity", "The quantity have to be fill").not().isEmpty(),
    //check("price", "The price have to be fill").not().isEmpty(),
    //check("discount", "The discount have to be fill").not().isEmpty(),
    //check("idStripe", "The idStripe have to be fill").not().isEmpty(),
    check("id", "Please send valid ID").isMongoId(),
    generalResult,
  ],
  productPut
);

productRouter.delete(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    check("name", "The name have to be fill").not().isEmpty(),
    check("idCloudinary", "The idCloudinary have to be fill").not().isEmpty(),
    check("urlCloudinary", "The urlCloudinary have to be fill").not().isEmpty(),
    check("quantityImg", "The quantityImg have to be fill").not().isEmpty(),
    generalResult,
  ],
  productDeleteImageUpdate
);

productRouter.put(
  "/",
  /*  "/:token", */
  [
    tokenVerification,
    check("name", "The name have to be fill").not().isEmpty(),
    //check("image", "The image have to be fill").not().isEmpty(),
    generalResult,
  ],
  productAddImageUpdate
);

productRouter.delete(
  "/:name",
  [
    tokenVerification,
    check("name", "The name have to be fill").not().isEmpty(),
    generalResult,
  ],
  productDelete
);

module.exports = productRouter;
