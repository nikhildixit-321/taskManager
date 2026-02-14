const express = require('express')
const { protect, adminOnly } = require('../middlewares/authMiddlerwares')
 const router = express.Router()
const {getUsers,getUserById,deleteUser} = require('../controller/userController')
//  USER Managerment routes
router.get('/',protect,adminOnly,getUsers)
router.get('/:id',protect,getUserById)
router.delete("/:id",protect,adminOnly,deleteUser)

module.exports = router;