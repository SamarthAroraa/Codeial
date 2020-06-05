const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments-controller");
const passport = require("passport");

router.post("/create", passport.checkAuthentication, commentsController.create);
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  commentsController.destroy
);
// router.post('/add-comment', passport.checkAuthentication, postController.addComment);
module.exports = router;
