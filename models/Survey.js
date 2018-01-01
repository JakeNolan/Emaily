const mongoose = require("mongoose");
const { Schema } = mongoose;
// this is called a subdocument collection in mongo
// you can do this but you don't want to do to much nesting like this
// bc mongo has a 4mb document maximum!
const RecipientSchema = require("./Recipient");

// _user! a way to set up a relationship
// called a reference field

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  dateSent: Date,
  lastResponded: Date,
});

mongoose.model("surveys", surveySchema);
