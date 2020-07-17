const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.create = async (req, res) => {
  try {
    let post = await Post.create({
      user: req.user._id,
      content: req.body.content,
    });
    // console.log(post);
    if (req.xhr) {
      req.flash("success", "Post published!");
      post = await post.populate("user", "name").execPopulate();
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post created",
      });
    }
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Unexpected error!");

    console.log(err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      await Comment.deleteMany({ post: req.params.id });
      post.remove();
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }
      req.flash("success", "Post deleted");

      return res.redirect("back");
    } else {
      req.flash("error", "You are not authorized to delete this post");

      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "Unexpected error!");

    return res.redirect("back");
  }
};
