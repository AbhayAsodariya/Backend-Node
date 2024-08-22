const express = require("express");
const crypto = require("crypto");
const Person = require("../models/Person");
const router = express.Router();

const ENCRYPTION_KEY = "464588256654sadsdsaadsyrtegyiov2"; // Replace with a 32-character key
const IV_LENGTH = 16; // AES block size

// Function to encrypt a password
function encryptPassword(password) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(password, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// Function to decrypt the password
function decryptPassword(encryptedPassword) {
  const [iv, encrypted] = encryptedPassword.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, work, salary, username, password } = req.body;

    const existingPerson = await Person.findOne({
      $or: [{ email }, { mobile }, { username }],
    });

    if (existingPerson) {
      return res
        .status(400)
        .json({ error: "Email, mobile, or username already exists" });
    }

    const encryptedPassword = encryptPassword(password);

    const newPerson = new Person({
      name,
      email,
      mobile,
      work,
      salary,
      username,
      password: encryptedPassword,
    });

    const response = await newPerson.save();
    res
      .status(201)
      .json({ message: "User registered successfully", person: response });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const person = await Person.findOne({ username });

    if (!person) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const decryptedPassword = decryptPassword(person.password);

    if (decryptedPassword !== password) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: person._id, username: person.username },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Protected Route Example
router.get("/protected", (req, res) => {
  res.json({ message: "You have accessed a protected route!" });
});

// Route to get all registered persons with decrypted passwords
router.get("/", async (req, res) => {
  try {
    const persons = await Person.find(); // Fetch all persons from the database
    const decryptedPersons = persons.map((person) => ({
      ...person.toObject(),
      password: decryptPassword(person.password), // Decrypt password before sending
    }));
    res.status(200).json(decryptedPersons); // Send the list of persons as a JSON response
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a person by ID with decrypted password
router.get("/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id); // Fetch a specific person by ID
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    const decryptedPerson = {
      ...person.toObject(),
      password: decryptPassword(person.password), // Decrypt password before sending
    };
    res.status(200).json(decryptedPerson); // Send the person data as a JSON response
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
