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

              userObj.token = jwt;
              return res.json({ user: userObj });
            } else {
              return res.json({
                message: "Password is incorrect",
              });
            }
          })
          .catch((error) => {
            return res.json({
              message: "Internal server error",
            });
          });
      }
    })
    .catch((error) => {
      return res.json({ message: "Internal server error" });
    });
});

module.exports = routes;
