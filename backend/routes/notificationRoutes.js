const express = require("express");
const { protect } = require("../middlewares/authMiddlerwares");
const { 
    getNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification
} = require("../controller/notificationController");

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
