const express = require("express");
const cors = require("cors");
const db = require("./db/db");

const app = express();

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

app.use(express.json());
const articleRoutes = require("./routes/article");
const userRoutes = require("./routes/user");
const userSingleRoute = require("./routes/userSingle");
const loginRoute = require("./routes/login");
const error = require("./routes/error");

app.use(cors());

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user", userSingleRoute);
app.use("/api/login", loginRoute);

//404 error
app.use(error);

mongoose
  .connect(db)
  .then((result) => {
    app.listen(3001);
  })
  .catch((error) => {
    console.log(error);
  });
