const http = require("http");
const express = require("express");

const app = express();

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

app.use(express.json());
const articleRoutes = require("./routes/article");
const userRoutes = require("./routes/user");
const loginRoute = require("./routes/login");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoute);

//404 error
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not Found",
    errorCode: "404",
  });
});

mongoose
  .connect("mongodb://localhost/test")
  .then((result) => {
    app.listen(3001);
  })
  .catch((error) => {
    console.log(error);
  });
