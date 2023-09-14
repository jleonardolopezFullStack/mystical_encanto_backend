const { Router } = require("express");
const { check } = require("express-validator");
const { checkoutPost } = require("../controllers/checkoutController");

const checkoutRouter = Router();

checkoutRouter.post("/", checkoutPost);

module.exports = checkoutRouter;
