const Post = require("../models/post");
module.exports.home = function (req, res) {
  Post.find({})
    .populate("user")
    .exec(function (err, posts) {
      if (err) {
        console.log("error getting posts from DB");
        return;
      }
      return res.render("home", {
        title: "Codial | Home",
        feed: posts,
      });
    });
};
