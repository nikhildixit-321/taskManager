const express = require('express')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser, updateUserProfile, getUserProfile, gernerateToken } = require('../controller/authController')
const { protect } = require('../middlewares/authMiddlerwares')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')

// auth routes 
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile);

// Google OAuth routes
router.get('/google', (req, res, next) => {
    console.log('Google OAuth initiated');
    console.log('CLIENT_URL:', process.env.CLIENT_URL);
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        try {
            if (!req.user) {
                console.error('No user returned from Google OAuth');
                return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
            }
            
            // Generate JWT token
            const token = gernerateToken(req.user._id);
            
            // Redirect to frontend with token
            res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userId=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&role=${req.user.role}&profileImageUrl=${encodeURIComponent(req.user.profileImageUrl || '')}`);
        } catch (error) {
            console.error('Callback error:', error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
        }
    }
);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "NO FILE UPLOAD " })
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`
    res.status(200).json({ imageUrl })
})

module.exports = router;