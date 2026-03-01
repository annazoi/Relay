const express = require("express");
const router = express.Router();
const middleWare = require("../middlewares/authMiddleware");
const notificationController = require("../controllers/notifications");

router.get("/", middleWare.protect, notificationController.getNotifications);
router.get("/unread-count", middleWare.protect, notificationController.getUnreadCount);
router.put("/mark-all-read", middleWare.protect, notificationController.markAllRead);
router.put("/:id/read", middleWare.protect, notificationController.markRead);

module.exports = router;
