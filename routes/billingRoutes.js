const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  // express post requests will not by default parse for some reason
  // that's why we have to use bodyParser in the index.js
  // not invoking requireLogin like this requireLogin() bc express will call it internally
  // express doesn't care how many params or functions u pass in as long as one returns a response to the user
  app.post("/api/stripe", requireLogin, async (req, res) => {

    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      source: req.body.id
    });

    // this is setup automatically by passport
    req.user.credits += 5;

    const user = await req.user.save();

    res.send(user);
  });
};
