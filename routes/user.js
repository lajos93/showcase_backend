const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const routes = express.Router();

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

  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((result) => {
      if (result) {
        res.json({
          message: "User already exists",
        });
      } else {
        return bcrypt.hash(password, 12).then((hashedPassword) => {
          crypto.randomBytes(32, (err, buffer) => {
            if (err) {
              res.json({
                message: "Server error",
              });
            }
            const token = buffer.toString("hex");
            const user = new User({
              username: username,
              email: email,
              password: hashedPassword,
              token: token,
            });
            user.save().then((userData) => {
              const userObj = userData.toObject();
              delete userObj.password;
              res.json({ user: userObj });
            });
          });
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });

  /*   user.save().then((result) => {
    res.json(result);
  }); */
});

module.exports = routes;
