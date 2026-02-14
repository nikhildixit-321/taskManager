const Notification = require("../models/Notification");

// @desc Get user notifications
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        const query = { recipient: req.user._id };
        
        if (unreadOnly === "true") {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate("sender", "name email profileImageUrl")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ 
            recipient: req.user._id, 
            read: false 
        });

        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.read = true;
        await notification.save();

        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a notification
// @route DELETE /api/notifications/:id
// @access Private
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await notification.deleteOne();
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
