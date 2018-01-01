const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this is called a subdocument collection in mongo
const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

// this is called a subdocument collection in mongo
module.exports = recipientSchema;
