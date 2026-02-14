const mongoose = require("mongoose");

const recurringTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    frequency: { 
        type: String, 
        enum: ["daily", "weekly", "monthly", "custom"],
        required: true 
    },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday
    dayOfMonth: { type: Number, min: 1, max: 31 },
    customInterval: { type: Number }, // Every X days
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    nextRunDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    todoChecklist: [{ text: String, completed: { type: Boolean, default: false } }],
    lastCreatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }
}, { timestamps: true });

module.exports = mongoose.model("RecurringTask", recurringTaskSchema);
