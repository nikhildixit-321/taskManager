const RecurringTask = require("../models/RecurringTask");
const Task = require("../models/Task");
const { createNotification } = require("./notificationHelper");

const calculateNextRunDate = (recurringTask) => {
    const now = new Date();
    let nextDate = new Date(recurringTask.nextRunDate);

    switch (recurringTask.frequency) {
        case "daily":
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case "weekly":
            if (recurringTask.daysOfWeek && recurringTask.daysOfWeek.length > 0) {
                // Find next occurrence of specified days
                let daysUntilNext = 1;
                const currentDay = now.getDay();
                const sortedDays = recurringTask.daysOfWeek.sort((a, b) => a - b);
                
                for (const day of sortedDays) {
                    if (day > currentDay) {
                        daysUntilNext = day - currentDay;
                        break;
                    }
                }
                nextDate.setDate(now.getDate() + daysUntilNext);
            } else {
                nextDate.setDate(nextDate.getDate() + 7);
            }
            break;
        case "monthly":
            if (recurringTask.dayOfMonth) {
                nextDate.setMonth(nextDate.getMonth() + 1);
                nextDate.setDate(recurringTask.dayOfMonth);
            } else {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }
            break;
        case "custom":
            if (recurringTask.customInterval) {
                nextDate.setDate(nextDate.getDate() + recurringTask.customInterval);
            }
            break;
    }

    return nextDate;
};

const processRecurringTasks = async (io) => {
    try {
        const now = new Date();
        const recurringTasks = await RecurringTask.find({
            isActive: true,
            nextRunDate: { $lte: now },
            $or: [
                { endDate: { $exists: false } },
                { endDate: { $gte: now } }
            ]
        });

        for (const recurringTask of recurringTasks) {
            // Create new task from recurring task
            const newTask = await Task.create({
                title: recurringTask.title,
                description: recurringTask.description,
                priority: recurringTask.priority,
                dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
                assignedTo: recurringTask.assignedTo,
                createdBy: recurringTask.createdBy,
                todoChecklist: recurringTask.todoChecklist.map(item => ({
                    text: item.text,
                    completed: false
                })),
                attachments: []
            });

            // Update recurring task
            recurringTask.lastCreatedTask = newTask._id;
            recurringTask.nextRunDate = calculateNextRunDate(recurringTask);
            await recurringTask.save();

            // Send notifications to assignees
            for (const assigneeId of recurringTask.assignedTo) {
                await createNotification({
                    recipient: assigneeId,
                    sender: recurringTask.createdBy,
                    type: "task_assigned",
                    title: "New Recurring Task",
                    message: `A new recurring task has been created: ${recurringTask.title}`,
                    task: newTask._id,
                    link: `/user/task-details/${newTask._id}`
                }, io);
            }

            console.log(`Created recurring task: ${recurringTask.title}`);
        }
    } catch (error) {
        console.error("Error processing recurring tasks:", error);
    }
};

module.exports = { processRecurringTasks, calculateNextRunDate };
