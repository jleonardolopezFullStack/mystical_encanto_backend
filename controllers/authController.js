const User = require("../models/authSchema");
const bcryptjs = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const user = await User.find();

    res.json({ msg: `Get controllador de auth`, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get User" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ msg: "This ID doesnt exist, try again" });
    }

    res.json({ msg: `Get controllador de auth One`, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Get Users" });
  }
};

const postUser = async (req, res) => {
  const { name, email, password } = req.body;

  const salt = bcryptjs.genSaltSync(10);
  const newPassword = bcryptjs.hashSync(password, salt);

  try {
    const data = {
      name,
      email,
      password: newPassword,
    };

    const user = new User(data);
    const verifyUser = await User.findOne({ email });
    console.log(verifyUser);
    if (verifyUser) {
      return res.json({ msg: "User already exist, let try in login seccion" });
    }

    await user.save();
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Post User" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, newPassword, email } = req.body;

  try {
    //Aqui falta validar de que primero este logeado o que se sepa que el que quiere cambiar, es el en verdad
    if (newPassword) {
      const salt = bcryptjs.genSaltSync(10);
      const newNewPassword = bcryptjs.hashSync(newPassword, salt);
      const user = await User.findByIdAndUpdate(
        id,
        { password: newNewPassword },
        { new: true }
      );
      return res.json({
        msg: `Put controllador de auth con cambio password`,
        user,
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    res.json({ msg: `Put controllador de auth`, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Put User" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndRemove(id, { new: true });

    res.json({ msg: `Delete controllador de auth`, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Delete User" });
  }
};

module.exports = { getUsers, getUser, postUser, updateUser, deleteUser };
