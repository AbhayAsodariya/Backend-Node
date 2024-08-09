const mongoose = require("mongoose");

// Define the schema for a person
const personSchema = new mongoose.Schema({
  // Name of the person
  name: {
    type: String,
    required: true,
  },
  // Age of the person
  age: {
    type: Number,
  },
  // Work type of the person (must be one of 'chef', 'waiter', 'manager')
  work: {
    type: String,
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  // Mobile number of the person
  mobile: {
    type: String,
    required: true,
  },
  // Email address of the person (must be unique)
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Address of the person
  address: {
    type: String,
  },
  // Salary of the person
  salary: {
    type: Number,
    required: true,
  },
});

// Create the model from the schema
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
