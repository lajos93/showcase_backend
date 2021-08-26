const express = require("express");
const bcrypt = require("bcrypt");
const routes = express.Router();
const token = require("../shared/token");

const User = require("../models/user");

routes.get("/", (req, res, next) => {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

routes.post("/", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    return res.json({ message: "username or email is required" });
  }

  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((result) => {
      if (result) {
        return res.json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
          });
          user.save().then((userData) => {
            const jwt = token.getToken(user.email, user._id);

            const userObj = userData.toObject();
            userObj.token = jwt;
            return res.json({ user: userObj });
          });
        });
      }
    })
    .catch((error) => {
      return res.json({ message: "Internal server error" });
    });
});

module.exports = routes;
