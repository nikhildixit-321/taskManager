const Notification = require("../models/Notification");

const createNotification = async (notificationData, io) => {
    try {
        const notification = await Notification.create(notificationData);
        
        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "name email profileImageUrl")
            .populate("task", "title");

        // Emit real-time notification via Socket.io
        if (io) {
            io.to(notificationData.recipient.toString()).emit('notification', populatedNotification);
        }

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

module.exports = { createNotification };
