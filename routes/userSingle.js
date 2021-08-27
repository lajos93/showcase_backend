const express = require("express");
const bcrypt = require("bcrypt");
const routes = express.Router();
const token = require("../shared/token");

const User = require("../models/user");

routes.put("/", token.verifyToken, (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const bio = req.body.bio;
  const image = req.body.image;

  if (!(username || email || bio || image)) {
    return res.json({
      message: "Username, bio, image or either one is required",
    });
  }

  const currentID = token.getDataFromToken(res.locals.token).payload.id;

  const filter = { _id: currentID };

  let update = {};
  if (username) update.username = username;
  if (email) update.email = email;
  if (bio) update.bio = bio;
  if (image) update.image = image;

  User.findOneAndUpdate(
    filter,
    { $set: update },
    {
      new: true,
      upsert: false,
    }
  ).then((result) => {
    if (!result) {
      //Normally you dont see this message
      return res.status(403).json({ message: "User is not found" });
    }

    return res.json(result);
  });
});

module.exports = routes;
