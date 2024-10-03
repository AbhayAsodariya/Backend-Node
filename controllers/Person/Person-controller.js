const bcrypt = require("bcrypt");
const Person = require("../../models/Person/Person");
const {
  jwtAuthMiddleware,
  generateToken,
} = require("../../middleware/authMiddleware"); // Import the middleware

// Register Controller
const register = async (req, res) => {
  const { name, email, mobile, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Person.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Person({
      name,
      email,
      mobile,
      username,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Person.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit User Controller
const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, username, password } = req.body;

  try {
    // Check if the user exists
    const user = await Person.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password if it's provided
    let hashedPassword = user.password; // Keep existing password if not changed
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.username = username || user.username;
    user.password = hashedPassword;

    // Save updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete User Controller
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Person.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get User by ID Controller
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find user by ID
    const user = await Person.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { register, login, editUser, deleteUser, getUserById, jwtAuthMiddleware };
