const express = require("express");
const bcrypt = require("bcrypt");
const routes = express.Router();
const token = require("../shared/token");

const User = require("../models/user");

routes.post("/", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.json({
          message: "User not found",
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              const jwt = token.getToken(user.email, user._id);
              const userObj = user.toObject();
              delete userObj.password;

              userObj.token = jwt;
              res.json({ user: userObj });
            } else {
              res.json({
                message: "Password is incorrect",
              });
            }
          })
          .catch((error) => {
            res.json({
              message: "Internal server error",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = routes;
