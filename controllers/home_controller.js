const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      let posts = await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      let users = await User.find({});

      return res.render("home", {
        title: "Codial | Home",
        feed: posts,
        users: users,
      });
    } else {
      return res.render("landing_page", { title: "Codeial" });
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
