const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      let posts = await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate("comments")
        .populate({
          path: "comments",
          options: { sort: { created_at: -1 } },
          populate: {
            path: "user",
          },
          // populate: {
          //   path: "likes",
          // },
        })
        .populate("likes");

      let users = await User.find({});
      // console.log();
      return res.render("home", {
        title: "Codial | Home",
        feed: posts,
        users: users,
        current_user: req.user,
      });
    } else {
      return res.render("landing_page", { title: "Codeial" });
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
