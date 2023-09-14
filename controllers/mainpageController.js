const Mainpage = require("../models/mainpageSchema");

const mainpageGet = async (req, res) => {
  try {
    const mainpage = await Promise.all([
      Mainpage.countDocuments(),
      Mainpage.find().populate("user", "name"),
    ]);

    res.json({ msg: "Mainpage Get", mainpage });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Main Page" });
  }
};

const mainpagePost = async (req, res) => {
  const { color, urlCloudinary, idCloudinary } = req.body;
  const token = req.user;
  try {
    const data = {
      color,
      urlCloudinary,
      idCloudinary,
      user: token.id,
    };

    const mainpage = new Mainpage(data);
    await mainpage.save();
    res.status(200).json({ msg: "mainpage Uploaded" });
  } catch (error) {
    res.json(error);
    res.status(400).json({ msg: "Something went wrong to Post Main Page" });
  }
};

const mainpagePut = async (req, res) => {
  const { id } = req.params;
  const { color } = req.body;

  try {
    const product = await Mainpage.findByIdAndUpdate(
      id,
      { color },
      { new: true }
    );

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Put Main Page" });
  }
};

const mainpageDelete = async (req, res) => {
  const { idCloudinary } = req.params;
  /* const { urlCloudinary } = req.body; */
  //console.log(idCloudinary);
  try {
    /*     const product = await Mainpage.findByIdAndRemove(id, { new: true }); */
    const product = await Mainpage.findOneAndRemove(
      { idCloudinary },
      { new: true }
    );

    const product2 = await Mainpage.findOneAndRemove(
      { urlCloudinary: "undefined" },
      { new: true }
    );
    res.status(200).json({ product, product2 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Delete Main Page" });
  }
};

module.exports = { mainpageGet, mainpagePost, mainpagePut, mainpageDelete };
