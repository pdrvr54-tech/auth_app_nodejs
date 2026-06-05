const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateSalt, hashPassword, validatePassword } = require("../utils/password");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password are required for Register" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = generateSalt();
    const { hash } = hashPassword(password, salt);

    const newUser = new User({ username, hash, salt });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password are required for Login" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isValid = validatePassword(password, user.salt, user.hash);
    if (!isValid) return res.status(400).json({ message: "Invalid username or password" });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
