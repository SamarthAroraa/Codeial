const express = require("express");
const router = express.Router();
const friendshipController = require("../controllers/friendship.controller");
const passport = require("passport");

router.get("/add/:id", passport.checkAuthentication, friendshipController.add);
router.get(
  "/remove/:id",
  passport.checkAuthentication,
  friendshipController.remove
);

module.exports = router;
