export const BASE_URL = "https://taskmanager-vexi.onrender.com"
// utils/apiPaths.js
export const API_PATHS = {
    AUTH:{
        REGISTER:"/api/auth/register",
        LOGIN :"/api/auth/login",
        GET_PROFILE:"/api/auth/profile",
        GOOGLE_LOGIN:"/api/auth/google"
    },
    USER:{
       GET_ALL_USERS:"/api/users",
       GET_USER_BY_ID:(userId)=> `/api/users/${userId}`,
       CREATE_USER:"/api/users",
       UPDATE_USER:(userId)=>`/api/users/${userId}`,
       DELETE_USER:(userId)=>`/api/users/${userId}`
    },
    TASKS:{
      GET_DASHBOARD_DATA:"/api/tasks/dashboard-data",
      GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data",
      GET_ALL_TASKS:"/api/tasks",
      GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}`,
      CREATE_TASK:"/api/tasks",
      UPDATE_TASK:(taskId)=> `/api/tasks/${taskId}`,
      DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,
      UPDATE_TASK_STATUS:(taskId)=> `/api/tasks/${taskId}/status`,
      UPDATE_TODO_CHECKLIST:(taskId)=> `/api/tasks/${taskId}/todo`
    },
    COMMENTS:{
      GET_TASK_COMMENTS:(taskId)=>`/api/comments/task/${taskId}`,
      ADD_COMMENT:(taskId)=>`/api/comments/task/${taskId}`,
      UPDATE_COMMENT:(commentId)=>`/api/comments/${commentId}`,
      DELETE_COMMENT:(commentId)=>`/api/comments/${commentId}`
    },
    NOTIFICATIONS:{
      GET_ALL:"/api/notifications",
      MARK_AS_READ:(id)=>`/api/notifications/${id}/read`,
      MARK_ALL_AS_READ:"/api/notifications/read-all",
      DELETE:(id)=>`/api/notifications/${id}`
    },
    TEMPLATES:{
      GET_ALL:"/api/templates",
      CREATE:"/api/templates",
      UPDATE:(id)=>`/api/templates/${id}`,
      DELETE:(id)=>`/api/templates/${id}`,
      CREATE_TASK:(id)=>`/api/templates/${id}/create-task`
    },
    RECURRING_TASKS:{
      GET_ALL:"/api/recurring-tasks",
      CREATE:"/api/recurring-tasks",
      UPDATE:(id)=>`/api/recurring-tasks/${id}`,
      DELETE:(id)=>`/api/recurring-tasks/${id}`,
      TOGGLE:(id)=>`/api/recurring-tasks/${id}/toggle`
    },
    REPORTS:{
      EXPORT_TASKS:"/api/reports/export/tasks",
      EXPORT_USERS:"/api/reports/export/users"
    },
    IMAGE:{
     UPLOAD_IMAGE:"/api/auth/upload-image"
    },
}