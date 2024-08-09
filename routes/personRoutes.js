const express = require("express");
const router = express.Router();
const Person = require("./../models/Person");

// Route to create a new person
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Create a new Person instance with the provided data
    const newPerson = new Person(data);

    // Check if a person with the same email already exists
    const existingPerson = await Person.findOne({ email: data.email });
    console.log(existingPerson);

    // If the person already exists, return an error response
    if (existingPerson) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      // Save the new person to the database
      const response = await newPerson.save();
      console.log("Data saved");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all persons
router.get("/", async (req, res) => {
  try {
    const data = await Person.find();
    console.log("Data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get persons by work type
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;

    // Validate work type and fetch persons accordingly
    if (
      workType === "chef" ||
      workType === "waiter" ||
      workType === "manager"
    ) {
      const response = await Person.find({ work: workType });
      console.log("Response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid work type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a person by ID
router.get("/person/:id", async (req, res) => {
  try {
    const personId = req.params.id;

    // Find the person by ID
    const person = await Person.findById(personId);

    // If the person is not found, return an error response
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("Person fetched");
    res.status(200).json(person);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a person's data by ID
router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedData = req.body;

    // Update the person's data
    const response = await Person.findByIdAndUpdate(personId, updatedData, {
      new: true,
      runValidators: true,
    });

    // If the person is not found, return an error response
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("Data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a person by ID
router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;

    // Delete the person from the database
    const response = await Person.findByIdAndDelete(personId);
    console.log("Data deleted");
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
