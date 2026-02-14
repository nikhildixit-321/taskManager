const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddlerwares");
const { 
    getRecurringTasks, 
    createRecurringTask, 
    updateRecurringTask, 
    deleteRecurringTask,
    toggleRecurringTask
} = require("../controller/recurringTaskController");

const router = express.Router();

router.get("/", protect, adminOnly, getRecurringTasks);
router.post("/", protect, adminOnly, createRecurringTask);
router.put("/:id", protect, adminOnly, updateRecurringTask);
router.delete("/:id", protect, adminOnly, deleteRecurringTask);
router.patch("/:id/toggle", protect, adminOnly, toggleRecurringTask);

module.exports = router;
