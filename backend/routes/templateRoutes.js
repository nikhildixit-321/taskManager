const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddlerwares");
const { 
    getTemplates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    createTaskFromTemplate
} = require("../controller/templateController");

const router = express.Router();

router.get("/", protect, getTemplates);
router.post("/", protect, adminOnly, createTemplate);
router.put("/:id", protect, adminOnly, updateTemplate);
router.delete("/:id", protect, adminOnly, deleteTemplate);
router.post("/:id/create-task", protect, adminOnly, createTaskFromTemplate);

module.exports = router;
