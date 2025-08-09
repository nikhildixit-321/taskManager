const Task  = require('../models/Task')
const User = require('../models/User')
const bcrypt = require('bcryptjs')



// @desc get all user (admin only)
// @route get /api/users/
// @access private(admin)
const getUsers = async (req,res)=>{
    try {
        const users  = await User.find({role:'member'}).select('-password')
        // add task counts to each other
        const usersWithTaskCounts = await Promise.all(users.map(async (user)=>{
        const pendingTasks = await Task.countDocuments({assignedTo:user._id,status:"Pending"})
        const inProgressTasks = await Task.countDocuments({assignedTo:user._id,status:"In progress"})
        const completedTasks = await Task.countDocuments({assignedTo:user._id,status:"completed"})

      return{
        ...user._doc,//include all existing user data
        pendingTasks,
        inProgressTasks,
        completedTasks
      }

    }))
    res.json(usersWithTaskCounts)
    } catch (error) {
        res.status(500).json({message:"server error",error:error.message})
    }
};
// @desc get all user (admin only)
// @route get /api/users/:id
// @access private
const getUserById =async (req,res)=>{
   try {
    const user = await User.findById(req.params.id).select("-password");
    if(!user) return res.status(404).json({message:"User not found"})
        res.json(user);
   } catch (error) {
    res.status(500).json({message:"server error",error:error.message})
   }
}
// @desc get all user (admin only)
// @route get /api/users/:id
// @access private(admin)


module.exports = {
     getUsers,getUserById
}