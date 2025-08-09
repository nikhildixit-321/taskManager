 const express = require('express')
const { registerUser, loginUser, updateUserProfile, getUserProfile } = require('../controller/authController')
const { protect } = require('../middlewares/authMiddlerwares')
 const router = express.Router()
 const upload = require('../middlewares/uploadMiddleware')
//  auth routes 
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile);

router.post("/upload-image",upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"NO FILE UPLOAD "})
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`
    res.status(200).json({imageUrl})
})

module.exports = router;