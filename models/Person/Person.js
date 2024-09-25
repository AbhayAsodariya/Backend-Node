const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  username: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("Person", personSchema);
