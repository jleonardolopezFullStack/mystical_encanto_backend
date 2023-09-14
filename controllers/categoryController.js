/* const axios = require("axios"); */
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

const categoryGet = async (req, res) => {
  try {
    const categorys = await Promise.all([
      Category.countDocuments(),
      Category.find().populate("user", "name"),
    ]);
    categorys
      ? res.json({ msg: "category Get", categorys })
      : res.json({
          msg: "something went wrong, try again to get categorys",
        });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Category" });
  }
};
const categoryGetOne = async (req, res) => {
  const { name } = req.params;

  try {
    const category = await Category.findOne({ name }).populate("user", "name");
    category
      ? res.json({ msg: "category Get One", category })
      : res.json({
          msg: "something went wrong, try again to get category",
        });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get one Category" });
  }
};

const categoryPost = async (req, res) => {
  const { name, color1, color2 } = req.body;
  const user = req.user;

  try {
    const data = {
      name,
      color1,
      color2,
      user: user.id,
    };
    const category = new Category(data);
    const newCategory = await category.save();
    newCategory
      ? res.json({ msg: "category Post", newCategory })
      : res.json({
          msg: "something went wrong, try again to create a new category",
        });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Create Category" });
  }
};

const categoryUpdate = async (req, res) => {
  const { id } = req.params;
  const { name, state } = req.body;

  try {
    //Aqui falta validar de que primero este logeado o que se sepa que el que quiere cambiar, es el en verdad
    if (name) {
      const user = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      return res.json({
        msg: `Have been update the name of the category`,
        user,
      });
    }

    if (state === false) {
      const user = await Category.findByIdAndUpdate(
        id,
        { state },
        { new: true }
      );
      return res.json({
        msg: `Have been update the state of the category, now is in False`,
        user,
      });
    }
    const user = await Category.findByIdAndUpdate(
      id,
      { state: true },
      { new: true }
    );
    res.json({
      msg: `Have been update the state of the category, now is in true`,
      user,
    });
  } catch (error) {
    res.json(error);
    res.status(400).json({ msg: "Something went wrong to Update Category" });
  }
};

const categoryDelete = async (req, res) => {
  const { name } = req.params;

  const productDelete = async (nameProduct) => {
    const name = nameProduct;
    //console.log(name);
    try {
      const getProduct = await Product.findOne({ name });
      //console.log(getProduct);
      let quantityImg = 0;
      const deleteImgInCloudinary = getProduct?.idCloudinary.map(
        async (img) => {
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
        }
      );

      //console.log(deleteImgInCloudinary);

      if (deleteImgInCloudinary) {
        fs.rmdirSync(`./img/uploads/${name}`);
        fs.rmdirSync(`./img/optimize/${name}`);
        const product = await Product.findOneAndRemove({ name });
        //console.log(product);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////
  try {
    const findProductByCategory = await Product.find().populate(
      "category",
      "name"
    );
    //console.log(findProductByCategory);
    const productsFilterByCategory = findProductByCategory.filter((product) => {
      return product.category.name === name;
    });
    console.log(productsFilterByCategory);
    productsFilterByCategory.length > 0
      ? productsFilterByCategory.map((product) => productDelete(product.name))
      : /*       ? productDelete(productsFilterByCategory[0].name) */
        console.log("something verryyyyyyyy");

    //console.log(productsFilterByCategory[0].name);
    /*     res.json({
      msg: "Mirando",
    }); */
    const category = await Category.findOneAndRemove({ name });
    category
      ? res.json({ msg: "Category delete", category })
      : res.json({
          msg: "Something went wrong, try again to delete category",
        });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Delete Category" });
  }
};

module.exports = {
  categoryGet,
  categoryGetOne,
  categoryPost,
  categoryUpdate,
  categoryDelete,
};
