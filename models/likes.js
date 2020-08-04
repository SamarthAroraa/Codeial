const mongoose = require("mongoose");
const User = require("../models/user");
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
    },
    //defines the object id of the liked object
    likeable: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: "onModel",
    },
    //this field is used to define type of the liked object since it is a dynamic reference path
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
