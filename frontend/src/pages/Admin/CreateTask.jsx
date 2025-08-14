import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utills/data'
import axiosInstance from '../../utills/axiosInstance'
import { API_PATHS } from '../../utills/apiPath'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../components/inputs/SelectDropdown'
import SelectUsers from '../../components/inputs/SelectUsers'
import TodoListInput from '../../components/inputs/TodoListInput'
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput'

const CreateTask = () => {
  const location = useLocation()
  const { taskId } = location.state || {}
  const navigate = useNavigate()
  const [error, setError] = useState("");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "", // fixed spelling from "dueData"
    assignedTo: [],
    todoChecklist: [],
    attachment: []
  })

  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData(prevData => ({
      ...prevData,
      [key]: value
    }))
  }

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachment: []
    })
  }

  const createTask = async () => { 
    setLoading(true)
    try {
      const todolist = taskData.todoChecklist?.map((item)=>({
        text:item,
        completed:false
      }))
      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        dueDate:new Date(taskData.dueDate).toISOString(),
        todoChecklist:todolist,
      })
      toast.success("Task Created Successfully")
      clearData()
    } catch (error) {
      console.error("Error creating task:",error)
      setLoading(false)

    }finally{
      setLoading(false)
    }
   }
  const updateTask = async () => { /* API call here */ }
  const handleSubmit = async () => { 
    setError(null)
    // Input validation
    if(!taskData.title.trim()){
      setError("Title is required")
      return 
    }
    if(!taskData.description.trim()){
      setError("Description is required")
      return;
    }
    if(!taskData.dueDate){
      setError("Due date is required")
      return
    }
    if(taskData.assignedTo?.length === 0){
      setError( "Task not assigned to any member")
      return;
    }
    if(taskData.todoChecklist?.length === 0){
      setError("add atleast one todo task");
      return
    }
    if(taskId){
      updateTask()
      return
    }
    createTask();
  }
  const getTaskDetailsByID = async () => { /* fetch details here */ }
  const deleteTask = async () => { /* delete task here */ }

  return (
    <DashboardLayout activeMenu={taskId ? "Update Task" : "Create Task"}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-card col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* Task Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>
              <input
                className="form-input"
                placeholder="Create APP UI"
                value={taskData.title}
                onChange={({ target }) => handleValueChange("title", target.value)}
              />
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea
                placeholder="Describe task"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => handleValueChange("description", target.value)}
                className="form-input"
              />
            </div>

            {/* Priority, Due Date, Assign To */}
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange("dueDate", target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList = {taskData?.todoChecklist}
                setTodoList = {(value)=>{
                  handleValueChange("todoChecklist",value)
                }}/>
            </div>
            <div className="">
              <label htmlFor="" className=''  >
                Add Attachements
              </label>
              <AddAttachmentsInput
              attachment={taskData?.attachment}
              setAttachment = {(value)=>
                handleValueChange("attachment",value)
              }/>
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}
            <div className="flex justify-end mt-7">

            <button className='add-btn' onClick={handleSubmit} disabled={loading}>
              {taskId ? "UPDATE TASK": "CREATE TASK" }
            </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateTask
