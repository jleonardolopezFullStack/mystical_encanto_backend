const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productGet = async (req, res) => {
  try {
    const product = await Promise.all([
      Product.countDocuments(),
      Product.find().populate("user", "name").populate("category", "name"),
    ]);

    res.json({ msg: "product Get", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Delete Products" });
  }
};

const productGetOne = async (req, res) => {
  const { name } = req.params;

  try {
    const product = await Product.findOne({ name })
      .populate("user", "name")
      .populate("category", "name");

    res.json({ msg: "product Get One", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Product" });
  }
};

/* const productPost = async (req, res) => {
  try {
    console.log(req);
    console.log(req.files);
    console.log(req.body);
    //const fileImg = req.files.image;
    res.status(200).json({ msg: "file Uploaded" });
  } catch (error) {
    console.log(error);
  }
}; */

const productPost = async (req, res) => {
  try {
    const fileImg = req.files.image;
    const token = req.user;
    const {
      name,
      category,
      variant,
      quantityImg,
      quantity,
      price,
      color,
      discount,
      idStripe,
    } = req.body;

    const getCategory = await Category.findOne({ name: category });
    if (!getCategory) {
      return res
        .status(400)
        .json({ msg: "The Category doesn't exist, please try again" });
    }

    const nameFolder = `${name.toUpperCase()}_${variant.toUpperCase()}`;
    const resizeImg = (filePath, fileName, size = 300) => {
      return sharp(filePath)
        .resize(size)
        .toFile(`./img/optimize/${nameFolder}/${fileName}`);
    };

    const createImgFolder = (nameFolder) => {
      fs.mkdir(nameFolder, function (err) {
        if (err) {
          console.error("error occured AQUIIIIIII", err);
          return;
        }
        console.log("directory created");
      });
    };

    createImgFolder(
      `./img/uploads/${name.toUpperCase()}_${variant.toUpperCase()}`
    );

    fileImg.mv(
      `./img/uploads/${nameFolder}/${name.toUpperCase()}_${variant.toUpperCase()}_${quantityImg}.png`,
      async function (err) {
        if (err) {
          console.log("error folder img:" + err);
          res.status(400).json({
            msg: "Something went wrong to Create Folder img for product",
            err,
          });
        } else {
          createImgFolder(
            `./img/optimize/${name.toUpperCase()}_${variant.toUpperCase()}`
          );

          resizeImg(
            `./img/uploads/${nameFolder}/${name.toUpperCase()}_${variant.toUpperCase()}_${quantityImg}.png`,
            `resize_${name.toUpperCase()}_${variant.toUpperCase()}_${quantityImg}.png`,
            100
          );
          const imageToCloudinary = `./img/uploads/${nameFolder}/${name.toUpperCase()}_${variant.toUpperCase()}_${quantityImg}.png`;

          const imgNew = await cloudinary.uploader.upload(imageToCloudinary);
          const data = {
            name: `${name.toUpperCase()}_${variant.toUpperCase()}`,
            category: getCategory.id,
            variant,
            quantityImg,
            quantity,
            user: token.id,
            price,
            color,
            discount,
            idStripe,
            idCloudinary: imgNew.public_id,
            urlCloudinary: imgNew.secure_url,
          };

          const product = new Product(data);
          await product.save();

          //console.log(product);
          res.status(200).json({ msg: "file Uploaded" });
        }
      }
    );
  } catch (error) {
    console.log("Folder error leo:" + error);
    res
      .status(400)
      .json({ msg: "Something went wrong with yje Folder", error });
  }
};

const productPut = async (req, res) => {
  const { id } = req.params;
  const { name, newName, variant, quantity, price, discount, idStripe } =
    req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name: newName, variant, quantity, price, discount, idStripe },
      { new: true }
    );

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Update Product" });
  }
};

const productDeleteImageUpdate = async (req, res) => {
  const { name, idCloudinary, urlCloudinary, quantityImg } = req.body;

  const getProduct = await Product.findOne({ name });

  try {
    if (getProduct && idCloudinary && urlCloudinary) {
      const imgIdCloudinary = getProduct.idCloudinary;
      const imgUrlCloudinary = getProduct.urlCloudinary;

      const rta1 = imgIdCloudinary.filter((id) => {
        if (id != idCloudinary) return true;
      });

      const rta2 = imgUrlCloudinary.filter((id) => {
        if (id != urlCloudinary) return true;
      });
      if (rta1 && rta2) {
        const nameImg = `${getProduct.name}_${quantityImg}.png`;
        // await cloudinary.uploader.destroy(idCloudinary);

        fs.unlinkSync(`./img/uploads/${getProduct.name}/${nameImg}`);
        fs.unlinkSync(`./img/optimize/${getProduct.name}/resize_${nameImg}`);
        const product = await Product.findOneAndUpdate(
          { name },
          {
            idCloudinary: rta1,
            urlCloudinary: rta2,
            quantityImg: getProduct.quantityImg - 1,
          },
          { new: true }
        );
        // console.log(product);
        res.status(200).json({ product });
      }

      await cloudinary.uploader.destroy(idCloudinary);
    } else {
      console.log("no existe getProduct");
      res.status(400).json({ msg: "check the id and url of the image" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Something went wrong to Delete an Image in Product" });
  }
};

const productAddImageUpdate = async (req, res) => {
  const fileImg = req.files.image;

  const { name } = req.body;

  const resizeImg = (filePath, fileName, size = 300) => {
    return sharp(filePath)
      .resize(size)
      .toFile(`./img/optimize/${name}/${fileName}`);
  };

  try {
    const getProduct = await Product.findOne({ name });

    if (getProduct) {
      const imgIdCloudinary = getProduct.idCloudinary;
      const imgUrlCloudinary = getProduct.urlCloudinary;

      fileImg.mv(
        `./img/uploads/${getProduct.name}/${getProduct.name}_${
          getProduct.quantityImg + 1
        }.png`,
        async function (err) {
          if (err) {
            res.status(400).json({ err });
          } else {
            resizeImg(
              `./img/uploads/${getProduct.name}/${getProduct.name}_${
                getProduct.quantityImg + 1
              }.png`,
              `resize_${getProduct.name}_${getProduct.quantityImg + 1}.png`,
              100
            );

            const imageToCloudinary = `./img/uploads/${getProduct.name}/${
              getProduct.name
            }_${getProduct.quantityImg + 1}.png`;

            const imgNew = await cloudinary.uploader.upload(imageToCloudinary);
            // console.log(imgNew);
            imgIdCloudinary.push(imgNew.public_id);
            imgUrlCloudinary.push(imgNew.secure_url);
            const data = {
              idCloudinary: imgIdCloudinary,
              urlCloudinary: imgUrlCloudinary,
              quantityImg: getProduct.quantityImg + 1,
            };

            const product = await Product.findByIdAndUpdate(
              getProduct.id,
              {
                idCloudinary: data.idCloudinary,
                urlCloudinary: data.urlCloudinary,
                quantityImg: data.quantityImg,
              },
              { new: true }
            );

            //console.log(product);
            res.status(200).json({ msg: "file Uploaded" });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ msg: "Something went wrong to Update an Image in Product" });
  }
};

const productDelete = async (req, res) => {
  const { name } = req.params;
  //console.log(name);
  try {
    const getProduct = await Product.findOne({ name });
    console.log(getProduct);
    let quantityImg = 0;
    const deleteImgInCloudinary = getProduct?.idCloudinary.map(async (img) => {
      fs.unlinkSync(
        `./img/uploads/${getProduct.name}/${getProduct.name}_${
          quantityImg + 1
        }.png`
      );
      fs.unlinkSync(
        `./img/optimize/${getProduct.name}/resize_${getProduct.name}_${
          quantityImg + 1
        }.png`
      );
      quantityImg += 1;
      await cloudinary.uploader.destroy(img);
    });

    //console.log(deleteImgInCloudinary);

    if (deleteImgInCloudinary) {
      fs.rmdirSync(`./img/uploads/${name}`);
      fs.rmdirSync(`./img/optimize/${name}`);
      const product = await Product.findOneAndRemove({ name });
      product
        ? res.json({ msg: "product Delete" })
        : res
            .status(400)
            .json({ msg: "Something went wrong, try again to Delete Product" });
    } else {
      res
        .status(400)
        .json({ msg: "Something went wrong to Delete id in Cloudinary" });
    }

    // console.log(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Delete Product" });
  }
};

module.exports = {
  productGet,
  productGetOne,
  productPost,
  productDelete,
  productPut,
  productDeleteImageUpdate,
  productAddImageUpdate,
};
