const express = require("express");
const router = express.Router();

const PostController = require("../controllers/post.controllers");
// const checkAuth = require('../middleware/check-auth');

router.get("/", PostController.getAllPosts);
router.post("/add", PostController.addPost);
router.get("/postById/:_id", PostController.getPostById);
router.get("/postByUserId/:id", PostController.getPostByUserId);
router.put("/:_id", PostController.updatePost);
router.delete("/:_id", PostController.deletePost);

module.exports = router;
