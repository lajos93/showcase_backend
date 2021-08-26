const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: false },
    bio: { type: String, required: false },
    password: { type: String, required: true },
  },
  {
    //Making sure password is not shown in the response, display id instead of _id
    toObject: {
      transform: function (doc, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.password;
        delete returnedObject.__v;
      },
    },
    toJSON: {
      transform: function (doc, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.password;
        delete returnedObject.__v;
      },
    },
  }
);

module.exports = mongoose.model("User", user);
