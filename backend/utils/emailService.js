const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

const sendTaskAssignedEmail = async (user, task, assignedBy) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1368EC;">New Task Assigned</h2>
            <p>Hi ${user.name},</p>
            <p>You have been assigned a new task by ${assignedBy.name}.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${task.title}</h3>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
                <p>${task.description || ''}</p>
            </div>
            <a href="${process.env.CLIENT_URL}/user/task-details/${task._id}" 
               style="background: #1368EC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Task
            </a>
        </div>
    `;
    
    await sendEmail(user.email, `New Task: ${task.title}`, html);
};

const sendDeadlineReminderEmail = async (user, task) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Task Deadline Approaching</h2>
            <p>Hi ${user.name},</p>
            <p>This is a reminder that the following task is due soon:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${task.title}</h3>
                <p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${task.status}</p>
            </div>
            <a href="${process.env.CLIENT_URL}/user/task-details/${task._id}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Task
            </a>
        </div>
    `;
    
    await sendEmail(user.email, `Reminder: ${task.title} is due soon`, html);
};

module.exports = {
    sendEmail,
    sendTaskAssignedEmail,
    sendDeadlineReminderEmail
};
