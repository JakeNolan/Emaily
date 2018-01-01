// Mailer is a  es6 also called es 2015 class
const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

// helper.Mail is an object that takes a lot of configuration
// and spits out a mailer. We are extending additional customization to it
class Mailer extends helper.Mail {
  // 1st arg is an object that has to have a subject and a recipients
  constructor({ subject, recipients }, content) {
    // since we are extneding helper.Mail super is what makes sure any of its constructors get executed
    super();

    this.sgApi = sendgrid(keys.sendGridKey);

    // all of this is send grid specific
    this.from_email = new helper.Email("no-reply@emaily.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    // have to register the body of the email for helper.Mail
    this.addContent(this.body);

    this.addClickTracking();

    this.addRecipients();
  }

  // this turns gives me back an array of helper.Email objects
  formatAddresses(recipients) {
    //es6 destructuring to get email off of every object within the map function
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  async send(){
      const request = this.sgApi.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: this.toJSON()
      });

     const response = await this.sgApi.API(request);
     return response
  }
}

module.exports = Mailer;
