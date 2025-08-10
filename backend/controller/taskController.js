const Task = require('../models/Task');
const { create } = require('../models/User');

// @desc get all tasks (admin: all , user:only assigned task)
// @route get /api/tasks
// @access private
const getTasks = async (req,res)=>{
    try {
        const {status} =req.query;
        let filter = {}
        if(status){
            filter.status = status;
        }
        let tasks ;
        if(req.user.role === "admin"){
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }else{
            tasks  = await Task.find({...filter,assignedTo:req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );}
            // add completed todo checklist count to each task 
            tasks = await Promise.all(
                tasks.map(async (task)=>{
                    const completedCount = task.todoChecklist.filter(
                        (item)=>item.completed
                    ).length;
                    return {...task._doc,completedTodoCount:completedCount}
                })
            )
        

        // status summary counts
    const allTasks = await Task.countDocuments(
        req.user.role ==="admin" ? {}:{assignedTo:req.user._id}
    );
    const pendingTasks = await Task.countDocuments({
        ...filter,
        status:"Pending",
        ...(req.user.role !== "admin"  && {assignedTo:req.user._id})
    })

  const inProgressTasks = await Task.countDocuments({
    ...filter,
    status:"In Progress",
    ...(req.user.role !== "admin" && {assignedTo: req.user._id}),

  })
  const completedTasks = await Task.countDocuments({
    ...filter,
    status:"Completed",
    ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    
  })
   res.json({
    tasks,
    statusSummary:{
        all:allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
    }
   })
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)

const getTaskById = async (req,res)=>{
     try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        if(!task) return res.status(404).json({message:"task not found"})
            res.json(task)
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}

// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const createTask = async (req,res)=>{
 try {
    const {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        attachments,
        todoChecklist,
    } = req.body
    if(!Array.isArray(assignedTo)){
        return res.status(400).json({message:"assignedto must be an array of user ids"})

    }
    const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        createdBy:req.user._id,
        todoChecklist,
        attachments
    })
    res.status(201).json({message:"task created successfully",task})
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const updateTask = async (req,res)=>{
 try {
   const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({message:"Task not found"})
    task.title = req.body.title || task.title;
    task.description = req.body.description ||  task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;
    if(req.body.assignedTo){
        if(!Array.isArray(req.body.assignedTo)){
            return res.status(400)
            .json({message:"assignedTo must be an array of user IDs"})
        }
        task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();
    res.json({message:"task update successfully ",updatedTask})
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)

const deleteTask = async (req,res)=>{
  try {
        const task = await Task.findById(req.params.id)
        if(!task) return res.status(404).json({message:"task not found"})
            await task.deleteOne();
        res.json({message :"task deleted successfully"})
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const updateTaskStatus = async (req,res)=>{
 try {
        const task = await Task.findById(req.params.id)
        if(!task) return res.status(404).json({message :"task not found"})
            const isAssigned = task.assignedTo.some(
           (userId) => userId.toString() === req.user._id.toString()
            )
            if(!isAssigned && req.user.role !== "admin"){
                return res.status(403).json({message :"NOT authorized"})
            }
            task.status = req.body.status || task.status
            if(task.status === "completed"){
                task.todoChecklist.forEach((item)=>(item.completed = true))
                task.progress =100;
            }
            await task.save()
            res.json({message:"task status updated",task})
    
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const updateTaskChecklist = async (req,res)=>{
 try {
        const {todoChecklist} =req.body;
        const task = await Task.findById(req.params.id)
        if(!task) return res.status(404).json({message:"task not found"})
            if(!task.assignedTo.includes(req.user._id) && req.user.role !="admin"){
                return res.status(403).json({message :"not authorized to update checklist"})
            }
       task.todoChecklist = todoChecklist;
    //    auto-update prograss based on checklis completion
    const completedCount = task.todoChecklist.filter(
        (item)=> item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems)*100): 0;
    // auto-marks task as completed
    if(task.progress ===100){
        task.status = "Completed"

    }else if (task.progress > 0){
        task.status = "In Progress"
    }
    else{
        task.status = "Pending"
    }
    await task.save();
    const updatedTask  = await Task.findById(req.params.id).populate(
        "assignedTo",
        "name email profileImageUrl"
    )
    res.json({message :"task checkllist updated",task:updatedTask})
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const getDashboardData = async (req,res)=>{
 try {
     // fetch statics 
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status:"pending"})
        const completedTasks = await Task.countDocuments({status:"Completed"})
        const overdueTasks = await Task.countDocuments({
            status:{$ne:"Completed"},
            dueDate:{$lt: new Date()}
        })
        const taskStatuses = ["Pending","In Progress", "Completed"]
        const taskDistributionRaw = await Task.aggregate([{
            $group :{
                _id : "$status",
                count:{$sum :1},

            },

        }])
       
        const taskDistribution = taskStatuses.reduce((acc,status)=>{
            const formattedKey = status.replace(/\s+/g,"");
            acc[formattedKey] = 
            taskDistributionRaw.find((item)=> item._id === status ) ?.count ||0
            return acc;
    
        },{})
        taskDistribution["all"] = totalTasks;
        // ensure all priority
        const taskPriorities = ["Low","Medium","High"]
        const taskPriorityLevelsRaw = await Task.aggregate([{
            $group:{
                _id:"$priority",
                count:{$sum :1}
            }
        }])
        const taskPriorityLevels = taskPriorities.reduce((acc,priority)=>{
            acc[priority]= taskPriorityLevelsRaw.find((item)=> item._id === priority) ?.count || 0;
            return acc;

        },{})
        // fetch recent 10 tasks
        const recentTasks = await Task.find()
        .sort({createdAt:-1})
        .limit(10)
        .select("title status priority deudate createAt")

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,

            },
            recentTasks,
        })
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const getUserDashboardData = async (req,res)=>{
 try {
    const userId = req.user._id // only fetch data for the logged-in user
    // fetch statistics for user-specific tasks 
    const totalTasks = await Task.countDocuments({assignedTo :userId})
    const pendingTasks = await Task.countDocuments({assignedTo:userId,status:"Pending"})
    const completedTasks = await Task.countDocuments({assignedTo:userId,status:"Completed"})
    const overdueTasks = await Task.countDocuments({
        assignedTo:userId,
        status:{$ne:"Completed"},
        dueDate:{$lt:new Date()}
    })
    // task distribution by status
    const taskStatuses = ["Pending","In Progress", "Completed"]
    const taskDistributionRaw = await Task.aggregate([
        {$match:{assignedTo:userId}},
        {$group :{_id:"$status",count:{$sum:1}}}
    ])
    const taskDistribution = taskStatuses.reduce((acc,status)=>{
        const formattedKey = status.replace(/\s+/g,"")
        acc[formattedKey] = 
        taskDistributionRaw.find((item)=> item._id === status)?.count || 0;
        return acc;
    },{})
    taskDistribution['All'] = totalTasks;
    // Task distribution by priority
    const taskPriorities = ["Low","Medium","High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
        {$match:{assignedTo:userId}},
        {$group:{_id:"$priority",count:{$sum:1}}}
    ])
    const taskPriorityLevels = taskPriorities.reduce((acc,priority)=>{
     acc[priority] = 
        taskPriorityLevelsRaw.find((item)=> item._id === priority)?.count || 0;
        return acc;
    },{})
    // fetch recent 10 tasks for the logged in user
    const recentTasks = await Task.find({assignedTo:userId})
    .sort({createdAt :-1})
    .limit(10)
    .select("title status priority duedate createdAt")
    
    res.status(200).json({
        statistics:{
            totalTasks,
            pendingTasks,
            completedTasks,
            overdueTasks
        },
        charts:{
            taskDistribution,
            taskPriorityLevels
        },
        recentTasks
    });
} catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
 module.exports  = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};