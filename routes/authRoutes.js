const passport = require("passport");

module.exports = app => {
  // the GoogleStrategy has an internal identifier called google that's where the first arg is coming from
  // the second arg is what we want to access from a google user
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account"
    })
  );

  // i will have a code when I come here GoogleStrategy will use that and give me some info
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    // passport attches this to the req object
    // passport kills the cookie and destroys the user
    req.logout();
    res.redirect("/");
  });

  // someone who has gone throught the oAuth flow can get access to the user
  app.get("/api/current_user", (req, res) => {
    //res.send(req.session);

    // passport attaches the user obj to the req object
    res.send(req.user);
  });
};
