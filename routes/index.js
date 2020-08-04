const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts.routes"));
router.use("/comments", require("./comments.routes"));
router.use("/api", require("./api"));
router.use("/likes",require("./likes"));
router.use("/friends",require("./friendships"));
module.exports = router;
