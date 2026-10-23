const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await user.save();

    const payload = { id: user.id, role: user.role };

    jwt.sign(payload, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "48h" }, (err, token) => {
      if (err) throw err;

      res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, role: user.role };

    jwt.sign(payload, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "48h" }, (err, token) => {
      if (err) throw err;

      res.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile
// @access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
