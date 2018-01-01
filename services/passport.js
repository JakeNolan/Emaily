const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

// fetching schema from mongoose
const User = mongoose.model("users");

// this is the user we just pulled out of the db
// whether we made one or found one
passport.serializeUser((user, done) => {
  // this id is the one assigned to our record by mongo not the googleID
  // do this bc if we have other oAuths they wont always have googleIDs
  done(null, user.id);
});

// first arg is a cookie, for us we used user.id
passport.deserializeUser((id, done) => {
  // anytime we touch a model class it is asyncronous
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClietnSecret,
      callbackURL: "/auth/google/callback", // this is the route that our user is sent to after they provide consent
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleID: profile.id });

      // returned is an existing model instance
      if (existingUser) {
        // have a record already

        // first arg is an err
        // don't need an else if I use the return keyword
        return done(null, existingUser);
      }
      // this is a mongoose model instance representing a single instance
      // anytime we touch a model class it is asyncronous

      const user = await new User({ googleID: profile.id }).save();
      done(null, user);
    }
  )
);
