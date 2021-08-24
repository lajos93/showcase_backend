const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: false },
  bio: { type: String, required: false },
  token: { type: String, required: false },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", user);
