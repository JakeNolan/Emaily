// this syntax is called common js modules
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
// this looks like this because that file doesn't return anything that we are going to use
// we just want to run it
require("./models/User"); // this must be above the passport service bc user attemps to be used in passport
require("./models/Survey");
require("./services/passport");

const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const surveyRoutes = require('./routes/surveyRoutes');

mongoose.connect(keys.mongoURI);
// !!! badass time saver when writing queries
// copy all above go to terminal and run: node
// you are now in the node cli
// do Survey = mongoose.model('surveys)
//then Survey.find({}).then(console.log)
// then Survey.find({title: 'super final test!!}).then(console.log)

// represents the underlying running express server
const app = express();

// each app.use are wiring up (middlewares) that run for every request in the app
app.use(bodyParser.json());

// tell express we want to make use of cookies in our app
app.use(
  // pass it this function and call it
  // this middleware basically just puts the token in the req.session property for passport
  cookieSession({
    // want cookie to last for 30 days (in milliseconds) before it expires
    // 30 days, 24 hrs in a day, 60 minutes in an hr, 60 seconds in a minute, 1000 milliseconds in a second
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // used to encrypt our stuff for security
    keys: [keys.cookieKey]
  })
);

// tell passport to use our cookies
app.use(passport.initialize());
app.use(passport.session());

// giving authRoutes access to the express app instance
// so we can make route handlers
authRoutes(app);
billingRoutes(app);
surveyRoutes(app);

// only want to run this if we are in production on heroku
if (process.env.NODE_ENV === "production") {
  // express will serve up production assets i.e. main.js or main.css

  // if any route comes in you don't recognize go look at this path first for a match
  // below will actually return and never get to the path stuff
  app.use(express.static("client/build"));

  // express will serve up index.html if it doesn't recognize the route
  // this is the catch all case
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// for heroku to do dynamic port binding
// heroku will give me a port at runtime
// or if I am in dev use port 5000
const PORT = process.env.PORT || 5000;
// this is express telling node to listen to a specific port
app.listen(PORT);

// this is a route handler
// forward slash is a root route, it's just implied by the browser
