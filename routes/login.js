const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const routes = express.Router();

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
              crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                  res.json({
                    message: "Server error",
                  });
                }
                const token = buffer.toString("hex");
                const userObj = user.toObject();
                delete userObj.password;
                userObj.token = token;

                res.json({ user: userObj });
              });
            } else {
              res.json({
                message: "Password is incorrect",
              });
            }
          })
          .catch((error) => {
            res.json({
              message: "Server error",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = routes;
