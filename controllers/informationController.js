const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Information = require("../models/informationSchema");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const informationGet = async (req, res) => {
  try {
    const information = await Promise.all([
      Information.countDocuments(),
      Information.find().populate("user", "name"),
    ]);

    res.json({ msg: "product Get", information });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Information" });
  }
};

const informationPost = async (req, res) => {
  //console.log(req.files);
  const fileImg = req.files.image;
  const { description, items } = req.body;
  const token = req.user;

  //console.log(items.split(","));
  const createImgFolder = (nameFolder) => {
    fs.mkdir(nameFolder, function (err) {
      if (err) {
        console.error("error occured", err);
        return;
      }
      console.log("directory created");
    });
  };

  createImgFolder(`./img/uploads/packaging`);

  try {
    fileImg.mv(`./img/uploads/packaging/img1.png`, async function (err) {
      if (err) {
        res.status(400).json({ err });
      } else {
        const imageToCloudinary = `./img/uploads/packaging/img1.png`;

        const imgNew = await cloudinary.uploader.upload(imageToCloudinary);
        // console.log(imgNew);
        const data = {
          description,
          //items: ["hola", "Nala", "Bella"],
          items: items.split(","),
          user: token.id,
          urlCloudinary: imgNew.secure_url,
          idCloudinary: imgNew.public_id,
        };

        const information = new Information(data);
        await information.save();
        res.status(200).json({ msg: "file Uploaded Information Section" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Something went wrong to Create information section" });
  }
};

const informationPut = async (req, res) => {
  const fileImg = req.files?.image;
  const { description, items } = req.body;

  const informationGet = await Information.find();
  // console.log(information[0].id);
  try {
    if (fileImg) {
      fileImg.mv(`./img/uploads/packaging/img1.png`, async function (err) {
        if (err) {
          res.status(400).json({ err });
        } else {
          const imageToCloudinary = `./img/uploads/packaging/img1.png`;

          const newCloudinaryImg = await Promise.all([
            cloudinary.uploader.destroy(informationGet[0].idCloudinary),
            cloudinary.uploader.upload(imageToCloudinary),
          ]);
          //console.log(newCloudinaryImg);
          const data = {
            urlCloudinary: newCloudinaryImg[1].secure_url,
            idCloudinary: newCloudinaryImg[1].public_id,
          };

          await Information.findByIdAndUpdate(informationGet[0].id, {
            urlCloudinary: data.urlCloudinary,
            idCloudinary: data.idCloudinary,
          });
        }
      });
    }

    const information = await Information.findOneAndUpdate(
      { _id: informationGet[0].id },
      {
        description,
        items: items?.split(","),
      },
      { new: true }
    );
    console.log(information);
    res.status(200).json({ msg: "Update information section" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Something went wrong to Update information section" });
  }
};

const informationDelete = async (req, res) => {
  const { idCloudinary, id } = req.body;

  try {
    const information = await Information.findByIdAndRemove(id);
    //console.log(getGallery.idCloudinary);
    await cloudinary.uploader.destroy(idCloudinary);
    res.json({ msg: "product Delete" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Something went wrong to Delete an Img from Gallery" });
  }
};

module.exports = {
  informationGet,
  informationPost,
  informationPut,
  informationDelete,
};
