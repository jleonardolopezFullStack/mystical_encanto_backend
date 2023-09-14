const Colors = require("../models/colorsSchema");

const colorsGet = async (req, res) => {
  try {
    const colors = await Promise.all([
      Colors.countDocuments(),
      Colors.find().populate("user", "name"),
    ]);

    res.json({ msg: "colors Get", colors });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Colors" });
  }
};

const colorsPost = async (req, res) => {
  const {
    colorNavbar,
    colorDashboard,
    colorProduct,
    colorGallery,
    colorCart,
    colorLetters,
  } = req.body;

  const token = req.user;
  try {
    const data = {
      colorNavbar,
      colorDashboard,
      colorProduct,
      colorGallery,
      colorCart,
      colorLetters,
      user: token.id,
    };

    const colors = new Colors(data);
    await colors.save();
    res.status(200).json({ msg: "colors Uploaded" });
  } catch (error) {
    res.json(error);
    res.status(400).json({ msg: "Something went wrong to Post Colors" });
  }
};

const colorsPut = async (req, res) => {
  const { id } = req.params;
  const {
    colorNavbar,
    colorDashboard,
    colorProduct,
    colorGallery,
    colorCart,
    colorLetters,
  } = req.body;

  const data = {
    colorNavbar: JSON.parse(colorNavbar),
    colorDashboard: JSON.parse(colorDashboard),
    colorProduct: JSON.parse(colorProduct),
    colorGallery: JSON.parse(colorGallery),
    colorCart: JSON.parse(colorCart),
    colorLetters: JSON.parse(colorLetters),
  };

  const newData = Object.entries(data);
  const reNewData = newData.filter((color) => {
    return color[1] !== null;
  });

  try {
    const colors = await Colors.findOneAndUpdate(
      { _id: id },
      {
        [reNewData[0][0]]: reNewData[0][1],
      },
      { new: true }
    );

    res.status(200).json({ colors });
    //res.status(200).json({ msg: "no llego" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Put Colors" });
  }
};

module.exports = { colorsGet, colorsPost, colorsPut };
