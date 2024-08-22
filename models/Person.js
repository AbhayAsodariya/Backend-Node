const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  work: String,
  salary: String,
  username: { type: String, unique: true },
  password: String, // This will store the encrypted password
});

const Person = mongoose.model("Person", personSchema);
module.exports = Person;
