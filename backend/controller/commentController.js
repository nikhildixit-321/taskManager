const Comment = require("../models/Comment");
const Task = require("../models/Task");
const { createNotification } = require("../utils/notificationHelper");

// @desc Get all comments for a task
// @route GET /api/comments/task/:taskId
// @access Private
const getTaskComments = async (req, res) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId })
            .populate("user", "name email profileImageUrl")
            .populate("mentions", "name email")
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Add a comment to a task
// @route POST /api/comments/task/:taskId
// @access Private
const addComment = async (req, res) => {
    try {
        const { text, attachments, mentions, parentComment } = req.body;
        const task = await Task.findById(req.params.taskId);
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const comment = await Comment.create({
            task: req.params.taskId,
            user: req.user._id,
            text,
            attachments: attachments || [],
            mentions: mentions || [],
            parentComment: parentComment || null
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("user", "name email profileImageUrl")
            .populate("mentions", "name email");

        // Send notifications to task assignees
        const io = req.app.get('io');
        for (const assigneeId of task.assignedTo) {
            if (assigneeId.toString() !== req.user._id.toString()) {
                await createNotification({
                    recipient: assigneeId,
                    sender: req.user._id,
                    type: "comment_added",
                    title: "New Comment",
                    message: `${req.user.name} commented on task: ${task.title}`,
                    task: task._id,
                    link: `/user/task-details/${task._id}`
                }, io);
            }
        }

        // Send notifications to mentioned users
        if (mentions && mentions.length > 0) {
            for (const mentionId of mentions) {
                if (mentionId.toString() !== req.user._id.toString()) {
                    await createNotification({
                        recipient: mentionId,
                        sender: req.user._id,
                        type: "mention",
                        title: "You were mentioned",
                        message: `${req.user.name} mentioned you in a comment`,
                        task: task._id,
                        link: `/user/task-details/${task._id}`
                    }, io);
                }
            }
        }

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update a comment
// @route PUT /api/comments/:commentId
// @access Private
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        comment.text = req.body.text || comment.text;
        comment.attachments = req.body.attachments || comment.attachments;
        
        const updatedComment = await comment.save();
        const populatedComment = await Comment.findById(updatedComment._id)
            .populate("user", "name email profileImageUrl")
            .populate("mentions", "name email");

        res.json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a comment
// @route DELETE /api/comments/:commentId
// @access Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTaskComments,
    addComment,
    updateComment,
    deleteComment
};
