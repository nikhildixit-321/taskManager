const express = require("express")
const {protect,adminOnly} = require("../middlewares/authMiddlerwares")
const { exportTaskReport, exportUserReport } = require("../controller/reportController")

const router = express.Router()
router.get("/export/tasks",protect,adminOnly,exportTaskReport)
router.get("/export/users",protect,adminOnly,exportUserReport)

module.exports =router;