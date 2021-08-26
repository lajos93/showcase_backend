const express = require("express");
const bcrypt = require("bcrypt");
const routes = express.Router();
const token = require("../shared/token");

const User = require("../models/user");

routes.get("/", token.verifyToken, (req, res, next) => {
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

routes.delete("/:email", token.verifyToken, (req, res, next) => {
  const email = req.params.email.trim();
  const filter = { email: email };

  const currentEmail = token.getDataFromToken(res.locals.token).payload.email;

  if (currentEmail == email) {
    return res.status(403).json({ message: "You can't delete yourself" });
  } else {
    User.findOneAndDelete(filter).then((result) => {
      if (!result) {
        return res.json({ message: "User not found" });
      }
      return res.json(result);
    });
  }
});

module.exports = routes;
