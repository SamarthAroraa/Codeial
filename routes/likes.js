const express = require("express");
const router = express.Router();
const likesController = require("../controllers/like.controller");

router.get("/toggle", likesController.toggleLike);

module.exports = router;
