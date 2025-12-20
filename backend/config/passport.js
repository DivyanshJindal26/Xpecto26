import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(',').map(e => e.trim().toLowerCase()) : [];
        const isAdmin = adminEmails.includes(email.toLowerCase());

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update role if admin status changed
          if (isAdmin && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
          } else if (!isAdmin && user.role === 'admin') {
            user.role = 'user';
            await user.save();
          }
          return done(null, user);
        }

        // Create new user if doesn't exist
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: email,
          avatar: profile.photos[0]?.value,
          role: isAdmin ? 'admin' : 'user',
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
