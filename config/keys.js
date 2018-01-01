// keys.js - figure out what credentials to return

// on heroku this variable will be set to production automatically
if (process.env.NODE_ENV === "production") {
  // return prod keys
  module.exports = require("./prod");
} else {
  // return dev keys

  // pulls the dev keys in and automatically exports them
  module.exports = require("./dev");
}
