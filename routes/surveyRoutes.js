const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url"); // this comes with node by default
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

// taking this approach instead of just straight requiring in the model
// bc mongoose has an issue around tests and these instances of objects
const Survey = mongoose.model("surveys");

module.exports = app => {

  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false}); // our way to whitelist what we get back from the query
    res.send(surveys);
  });

  // the colon stuff is a wildcard with express
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    // parsing our list of events we get from sendgrid
    const p = new Path("/api/surveys/:surveyId/:choice");

    // const events = _.map(req.body, event => {

    //   const pathname = new URL(event.url).pathname;
    //   const match = p.test(pathname);
    //   if (match) {
    //     return {
    //       email: event.email,
    //       surveyId: match.surveyId,
    //       choice: match.choice
    //     };
    //   }
    // });

    // // remove the elements that are undefined
    // const compactEvents = _.compact(events);

    // // removing duplicate records
    // const uniqueEvents = _.uniqBy(compactEvents, "email", "surveyId");

    //--------------------------------------------------------------------------------------------- _.chain helper function refactor
    // good for repetitive iteration steps over an array
    _.chain(req.body)
      .map(event => {
        const pathname = new URL(event.url).pathname;
        const match = p.test(pathname);
        if (match) {
          return {
            email: event.email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact() // removing the undefined events
      .uniqBy("email", "surveyId") // removing any duplicate records. Implies that one user can vote on many surveys
      .each(event => {
        Survey.updateOne(
          {
            _id: event.surveyId,
            recipients: {
              $elemMatch: { email: event.email, responded: false }
            }
          },
          {
            $inc: { [event.choice]: 1 }, // mongo operator to increment
            $set: { "recipients.$.responded": true }, // mongo operator set means to update. .$. is basically saying use the recipient found in the original query
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    // pull stuff out of request
    const { title, subject, body, recipients } = req.body;

    // create a new instance of a survey model
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => {
        return { email: email.trim() };
      }),
      _user: req.user.id,
      dateSent: Date.now()
    });

    try {
      // send the email
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();

      // save survey
      await survey.save();

      // reduce credits
      req.user.credits -= 1;
      const user = await req.user.save();

      // shoot this back to be dispatched to reducer and the header eventually
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
