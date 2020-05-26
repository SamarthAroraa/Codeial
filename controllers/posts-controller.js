const Post = require("../models/post");
module.exports.create = (req, res) =>
  Post.create({ user: req.user._id, content: req.body.content }, function (
    err,
    post
  ) {
    if (err) {
      console.log("error in creating post.");
      return;
    }
    return res.redirect("back");
  });
