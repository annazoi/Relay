const express = require("express");
const router = express.Router();
const middleWare = require("../middlewares/authMiddleware");
const postController = require("../controllers/posts");
const commentController = require("../controllers/comments");

// posts
router.post("/", middleWare.protect, postController.createPost);
router.delete("/:id", middleWare.protect, postController.deletePost);
router.get("/", middleWare.extractUser, postController.getPosts);
router.get("/:id", middleWare.extractUser, postController.getPost);
router.post("/:id/like", middleWare.protect, postController.likePost);
router.post("/:id/unlike", middleWare.protect, postController.unlikePost);

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
