const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  number: String,
});

const FreelistingSchema = new mongoose.Schema({
  files: [
    {
      filename: String,
      path: String,
      contentType: String,
    },
  ],
  firstname: String,
  middlename: String,
  lastname: String,
  email: String,
  number: String,
  businessname: String,
  description: String,
  location: String,
  pincode: String,
});

const User = mongoose.model("User", UserSchema);
const Freelisting = mongoose.model("Freelisting ", FreelistingSchema);

module.exports = { User, Freelisting };
