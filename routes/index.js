const express = require("express");
const homeController = require("../controllers/home_controller");
const router = express.Router();

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts.routes"));
router.use("/comments", require("./comments.routes"));

module.exports = router;
