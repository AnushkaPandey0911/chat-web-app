const express = require("express");
const User = require("../models/User"); // Ensure you have the User model
const router = express.Router();

// Get all users (excluding the logged-in user)
router.get("/", async (req, res) => {
    try {
        const users = await User.find({}, "username email"); // Fetch all users
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;
