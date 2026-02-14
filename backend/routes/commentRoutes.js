const express = require("express");
const { protect } = require("../middlewares/authMiddlerwares");
const { 
    getTaskComments, 
    addComment, 
    updateComment, 
    deleteComment 
} = require("../controller/commentController");

const router = express.Router();

router.get("/task/:taskId", protect, getTaskComments);
router.post("/task/:taskId", protect, addComment);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
