module.exports.home = function (req, res) {
  console.log(req.cookies);
  res.cookie("user-id", 25);
  res.render("home", {
    title: " Codial Home",
  });
};
