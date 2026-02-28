const express = require("express");
const router = express.Router();
const middleWare = require("../middlewares/authMiddleware");
const postController = require("../controllers/posts");
const commentController = require("../controllers/comments");

// posts
router.post("/", middleWare.protect, postController.createPost);
router.delete("/:id", middleWare.protect, postController.deletePost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);

// comments
router.post(
  "/:id/comments",
  middleWare.protect,
  commentController.createComment
);
router.delete(
  "/:id/comments/:commentId",
  middleWare.protect,
  commentController.deleteComment
);

// router.get("/:id/comments", commentController.getComments);
// router.get("/:id/comments/:commentId", commentController.getComment);

module.exports = router;
