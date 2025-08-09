const Task = require('../models/Task')

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
            );
            // add completed todo checklist count to each task 
            tasks = await Promise.all(
                tasks.map(async (task)=>{
                    const completedCount = task.todoChecklist.filter(
                        (item)=>{item.completed}
                    ).length;
                    return {...task._doc,completedTodoCount:completedCount}
                })
            )
        }

        // status summary counts
    const allTasks = await Task.countDocuments(
        req.user.role ==="admin" ? {}:{assignedTo:req.user._id}
    );
    const pendingTasks = await Task.countDocuments({
        ...filter,
        status:"pending",
        ...Task(req.user.role !== "admin"  && {assignedTo:req.user._id})
    })

  const inProgressTasks = await Task.countDocuments({
    ...filter,
    status:"in progress",
    ...(req.user.role !== "admin" && {assignedTo: req.user._id}),

  })
  const completedTasks = await Task.countDocuments({
    ...filter,
    status:"completed",
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
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)

const deleteTask = async (req,res)=>{
  try {
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const updateTaskStatus = async (req,res)=>{
 try {
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const updateTaskChecklist = async (req,res)=>{
 try {
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const getDashboardData = async (req,res)=>{
 try {
        
    } catch (error) {
       res.status(500).json({message:"Server error",error:error.message}) 
    }
}
// @desc get task by id
// @route get/api/tasks/:id
// @access private (admin)
const getUserDashboardData = async (req,res)=>{
 try {
        
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