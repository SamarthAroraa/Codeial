const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments.mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    let comment = await Comment.create({
      content: req.body.content,
      post: req.body.post,
      user: req.user._id,
    });
    post.comments.unshift(comment);
    post.save();
    comment = await comment.populate("user", "name email avatar").execPopulate();
    let job = queue.create("Email", comment).save(function (err) {
      if (err) {
        console.log("error in sending job to queue",err);
        return;
      }
      // console.log('job created',job.id);
    });
    // commentsMailer.newComment(comment);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          comment: comment,
        },
        message: "Post created!",
      });
    }

    req.flash("success", "Comment published!");

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: req.params.id },
      });
      comment.remove();
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment Deleted",
        });
      }
      return res.redirect("back");
    } else {
      console.log("deletion unauthorized");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
