const Like = require("../models/likes");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
  try {
    let likeable;
    let deleted = false;
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else if (req.query.type == "Comment") {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }
    //check if like already exists
    let existing = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });
    if (existing) {
      deleted = true;
      likeable.likes.pull(existing._id);
      likeable.save();
      existing.remove();
    } else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });
      likeable.likes.push(newLike._id);
      likeable.save();
    }
    return res.json(200, {
      message: "Request successful!",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    if (err) {
      console.log("Error while toggling like", err);
      return res.json(500, {
        message: "Internal Server Error",
      });
    }
  }
};
