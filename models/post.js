const mongoose = require("mongoose");


//////////////////////////////////////
//          Post Schema             //
//////////////////////////////////////
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //include array of ids of all comments for the post
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", //check
      },
    ],
    likes: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like"
      }
    ] 
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
