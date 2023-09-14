const mongoose = require("mongoose");
require("dotenv").config();

const connectionMongoose = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose
      .connect(mongoUrl)
      .then(() => console.log("Connected to DB!"));
  } catch (error) {
    console.log(`error:` + error);
    throw new Error(error);
  }
};

connectionMongoose();

module.exports = { connectionMongoose };
