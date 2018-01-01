const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
//using destructuring because the names are identical
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String,
  credits: { type: Number, default: 0 }
});

// this line creates our model class
// loading schema into mongoose
mongoose.model("users", userSchema);
