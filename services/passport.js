const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        googleID: profile.id,
      }).then(existingUser => {
        if (existingUser) {
          //we already have a record with ProfileID
          done(null, existingUser);
        } else {
          //dont have a record
          new User({
            googleID: profile.id,
            surname: profile.name.familyName,
            firstNames: profile.name.givenName,
          })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
