const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const article = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  body: { type: String, required: true },
  created: Number,
  updated: Number,
  tagList: { type: Array, required: false },
  favouriteCount: { type: Number, required: false },
});

module.exports = mongoose.model("Article", article);
