const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, role });
    await user.save();

   const payload = { id: user.id, role: user.role };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" }, (err, token) => {
      if (err) throw err;

      res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const payload = { id: user.id, role: user.role };


   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" }, (err, token) => {
  if (err) throw err;

  res.json({
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route GET/api/users/profile
//@desc Get logged-in user's profile (protected Route)
// @access private
router.get("/profile", protect,  async (req, res) =>{
  res.json(req.user);
})


module.exports = router;
