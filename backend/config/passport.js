const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV === 'production' 
                ? "https://taskmanager-vexi.onrender.com/api/auth/google/callback"
                : "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Google profile received:', JSON.stringify(profile, null, 2));
                
                // Check if profile has emails
                if (!profile.emails || profile.emails.length === 0) {
                    return done(new Error('No email found in Google profile'), null);
                }

                const email = profile.emails[0].value;
                const name = profile.displayName || profile.name?.givenName || 'User';
                const profileImageUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

                // Check if user already exists
                let user = await User.findOne({ email: email });

                if (user) {
                    // Update profile image if not set
                    if (!user.profileImageUrl && profileImageUrl) {
                        user.profileImageUrl = profileImageUrl;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = await User.create({
                    name: name,
                    email: email,
                    password: Math.random().toString(36).slice(-16),
                    profileImageUrl: profileImageUrl,
                    role: "member"
                });

                done(null, user);
            } catch (error) {
                console.error('Google OAuth error:', error);
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
