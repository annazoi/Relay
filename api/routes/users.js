const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

const middleWare = require("../middlewares/authMiddleware");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);
router.put("/:id/follow", middleWare.protect, userController.followUser);
router.put("/:id/unfollow", middleWare.protect, userController.unfollowUser);

module.exports = router;
