const mongoose = require("mongoose");

const todoTemplateSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const taskTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    defaultAssignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    todoChecklist: [todoTemplateSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("TaskTemplate", taskTemplateSchema);
