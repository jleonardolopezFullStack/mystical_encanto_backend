const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Gallery = require("../models/gallerySchema");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const galleryGet = async (req, res) => {
  try {
    const gallery = await Promise.all([
      Gallery.countDocuments(),
      Gallery.find().populate("user", "name"),
    ]);

    res.json({ msg: "product Get", gallery });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Gallery" });
  }
};

const galleryPost = async (req, res) => {
  console.log(req.files);
  const fileImg = req.files.image;

  const token = req.user;
  const createImgFolder = (nameFolder) => {
    fs.mkdir(nameFolder, function (err) {
      if (err) {
        console.error("error occured", err);
        return;
      }
      console.log("directory created");
    });
  };

  createImgFolder(`./img/uploads/gallery`);

  try {
    fileImg.mv(`./img/uploads/gallery/gallery1.png`, async function (err) {
      if (err) {
        res.status(400``).json({ err });
      } else {
        const imageToCloudinary = `./img/uploads/gallery/gallery1.png`;

        const imgNew = await cloudinary.uploader.upload(imageToCloudinary);
        //console.log(imgNew);
        const data = {
          user: token.id,
          urlCloudinary: imgNew.secure_url,
          idCloudinary: imgNew.public_id,
        };

        const gallery = new Gallery(data);
        await gallery.save();
        res.status(200).json({ msg: "file Uploaded" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Something went wrong to Create an Slider Image" });
  }
};

const galleryDelete = async (req, res) => {
  const { idCloudinary } = req.params;

  try {
    const getGallery = await Gallery.findOneAndRemove(
      { idCloudinary },
      { new: true }
    );
    //console.log(getGallery.idCloudinary);
    await cloudinary.uploader.destroy(getGallery.idCloudinary);
    res.json({ msg: "product Delete" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Something went wrong to Delete an Img from Gallery" });
  }
};

module.exports = {
  galleryPost,
  galleryGet,
  galleryDelete,
};
