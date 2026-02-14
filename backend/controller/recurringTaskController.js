const RecurringTask = require("../models/RecurringTask");

// @desc Get all recurring tasks
// @route GET /api/recurring-tasks
// @access Private (Admin)
const getRecurringTasks = async (req, res) => {
    try {
        const recurringTasks = await RecurringTask.find()
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email profileImageUrl")
            .sort({ createdAt: -1 });

        res.json(recurringTasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create a recurring task
// @route POST /api/recurring-tasks
// @access Private (Admin)
const createRecurringTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            assignedTo,
            frequency,
            daysOfWeek,
            dayOfMonth,
            customInterval,
            startDate,
            endDate,
            todoChecklist
        } = req.body;

        // Calculate next run date based on frequency
        let nextRunDate = new Date(startDate);
        if (nextRunDate < new Date()) {
            nextRunDate = new Date();
        }

        const recurringTask = await RecurringTask.create({
            title,
            description,
            priority,
            assignedTo,
            createdBy: req.user._id,
            frequency,
            daysOfWeek: daysOfWeek || [],
            dayOfMonth,
            customInterval,
            startDate,
            endDate,
            nextRunDate,
            isActive: true,
            todoChecklist: todoChecklist || []
        });

        const populatedTask = await RecurringTask.findById(recurringTask._id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email profileImageUrl");

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update a recurring task
// @route PUT /api/recurring-tasks/:id
// @access Private (Admin)
const updateRecurringTask = async (req, res) => {
    try {
        const recurringTask = await RecurringTask.findById(req.params.id);

        if (!recurringTask) {
            return res.status(404).json({ message: "Recurring task not found" });
        }

        const updateFields = [
            "title", "description", "priority", "assignedTo",
            "frequency", "daysOfWeek", "dayOfMonth", "customInterval",
            "startDate", "endDate", "todoChecklist"
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                recurringTask[field] = req.body[field];
            }
        });

        // Recalculate next run date if start date changed
        if (req.body.startDate) {
            recurringTask.nextRunDate = new Date(req.body.startDate);
            if (recurringTask.nextRunDate < new Date()) {
                recurringTask.nextRunDate = new Date();
            }
        }

        const updatedTask = await recurringTask.save();
        const populatedTask = await RecurringTask.findById(updatedTask._id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email profileImageUrl");

        res.json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a recurring task
// @route DELETE /api/recurring-tasks/:id
// @access Private (Admin)
const deleteRecurringTask = async (req, res) => {
    try {
        const recurringTask = await RecurringTask.findById(req.params.id);

        if (!recurringTask) {
            return res.status(404).json({ message: "Recurring task not found" });
        }

        await recurringTask.deleteOne();
        res.json({ message: "Recurring task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Toggle recurring task active status
// @route PATCH /api/recurring-tasks/:id/toggle
// @access Private (Admin)
const toggleRecurringTask = async (req, res) => {
    try {
        const recurringTask = await RecurringTask.findById(req.params.id);

        if (!recurringTask) {
            return res.status(404).json({ message: "Recurring task not found" });
        }

        recurringTask.isActive = !recurringTask.isActive;
        await recurringTask.save();

        res.json({ 
            message: `Recurring task ${recurringTask.isActive ? 'activated' : 'deactivated'}`,
            isActive: recurringTask.isActive
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getRecurringTasks,
    createRecurringTask,
    updateRecurringTask,
    deleteRecurringTask,
    toggleRecurringTask
};
