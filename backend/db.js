const mongoose = require("mongoose");
// const mongoURI = "mongodb://localhost:27017/NagpurDial1";
const mongoURI = "mongodb://nagpurdial_nagpurdialpsk:2HUqJfIWlZ@157.173.119.93:27017/nagpurdial_NagpurDial1?authSource=admin";
const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);

    console.log("mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
module.exports = connectToMongo;
