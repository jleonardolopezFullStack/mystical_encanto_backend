const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { connectionMongoose } = require("./db/mongooseConnection");
const authRouter = require("./router/authRoutes");
const loginRouter = require("./router/loginRoter");
const categoryRouter = require("./router/categoryRoutes");
const productRouter = require("./router/productRoutes");
const mainpageRouter = require("./router/mainPageRoutes");
const checkoutRouter = require("./router/checkoutRoutes");
const informationRouter = require("./router/informationRoutes");
const galleryRouter = require("./router/galleryRoutes");
const colorsRouter = require("./router/colorsRoutes");

const port = process.env.PORT;
const app = express();
//const port = 3002;

const links = {
  auth: "/auth",
  login: "/login",
  category: "/category",
  product: "/product",
  mainPage: "/mainpage",
  checkout: "/checkout",
  information: "/information",
  gallery: "/gallery",
  colors: "/colors",
};

app.use(
  cors({
    //origin: "https://janmovies.netlify.app",
    /*  methods: ["GET", "POST"],
    credentials: true,*/
  })
);
app.use(
  express.urlencoded({ extended: false, limit: 10000, parameterLimit: 5 })
);
app.use(express.static("public"));
app.use(fileUpload());
app.use(express.json());

app.use(links.auth, authRouter);
app.use(links.login, loginRouter);
app.use(links.category, categoryRouter);
app.use(links.product, productRouter);
app.use(links.mainPage, mainpageRouter);
app.use(links.checkout, checkoutRouter);
app.use(links.information, informationRouter);
app.use(links.gallery, galleryRouter);
app.use(links.colors, colorsRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ msg: "Page not found 404" });
});

app.listen(port, () => {
  console.log(`Listening in port ${port}`);
});
