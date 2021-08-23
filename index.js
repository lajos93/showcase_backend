const http = require("http");
const express = require("express");

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const articleRoutes = require("./routes/articles");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/api/articles", articleRoutes);

//404 error
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not Found",
    errorCode: "404",
  });
});

mongoose.connect("mongodb://localhost/test").then((result) => {
  app.listen(3001);
});
