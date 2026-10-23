const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

const handleSubscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let subscriber = await Subscriber.findOne({ email: email.toLowerCase().trim() });

    if (subscriber) {
      return res.status(400).json({ message: "This email is already subscribed" });
    }

    subscriber = new Subscriber({ email: email.toLowerCase().trim() });
    await subscriber.save();

    res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

router.post("/", handleSubscribe);
router.post("/subscribe", handleSubscribe);

module.exports = router;
