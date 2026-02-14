const TaskTemplate = require("../models/TaskTemplate");
const Task = require("../models/Task");

// @desc Get all templates
// @route GET /api/templates
// @access Private
const getTemplates = async (req, res) => {
    try {
        const query = {
            $or: [
                { createdBy: req.user._id },
                { isPublic: true }
            ]
        };
        
        const templates = await TaskTemplate.find(query)
            .populate("createdBy", "name email")
            .populate("defaultAssignees", "name email profileImageUrl")
            .sort({ createdAt: -1 });

        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create a template
// @route POST /api/templates
// @access Private (Admin)
const createTemplate = async (req, res) => {
    try {
        const { name, description, priority, defaultAssignees, todoChecklist, isPublic } = req.body;

        const template = await TaskTemplate.create({
            name,
            description,
            priority,
            defaultAssignees,
            todoChecklist: todoChecklist || [],
            createdBy: req.user._id,
            isPublic: isPublic || false
        });

        const populatedTemplate = await TaskTemplate.findById(template._id)
            .populate("createdBy", "name email")
            .populate("defaultAssignees", "name email profileImageUrl");

        res.status(201).json(populatedTemplate);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update a template
// @route PUT /api/templates/:id
// @access Private (Admin)
const updateTemplate = async (req, res) => {
    try {
        const template = await TaskTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { name, description, priority, defaultAssignees, todoChecklist, isPublic } = req.body;

        template.name = name || template.name;
        template.description = description || template.description;
        template.priority = priority || template.priority;
        template.defaultAssignees = defaultAssignees || template.defaultAssignees;
        template.todoChecklist = todoChecklist || template.todoChecklist;
        template.isPublic = isPublic !== undefined ? isPublic : template.isPublic;

        const updatedTemplate = await template.save();
        const populatedTemplate = await TaskTemplate.findById(updatedTemplate._id)
            .populate("createdBy", "name email")
            .populate("defaultAssignees", "name email profileImageUrl");

        res.json(populatedTemplate);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a template
// @route DELETE /api/templates/:id
// @access Private (Admin)
const deleteTemplate = async (req, res) => {
    try {
        const template = await TaskTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        await template.deleteOne();
        res.json({ message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create task from template
// @route POST /api/templates/:id/create-task
// @access Private (Admin)
const createTaskFromTemplate = async (req, res) => {
    try {
        const template = await TaskTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        const { dueDate, assignedTo, title, description } = req.body;

        const task = await Task.create({
            title: title || template.name,
            description: description || template.description,
            priority: template.priority,
            dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            assignedTo: assignedTo || template.defaultAssignees,
            createdBy: req.user._id,
            todoChecklist: template.todoChecklist.map(item => ({
                text: item.text,
                completed: false
            })),
            attachments: []
        });

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email profileImageUrl")
            .populate("createdBy", "name email");

        res.status(201).json({
            message: "Task created from template successfully",
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createTaskFromTemplate
};
