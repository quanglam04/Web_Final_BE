const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { login_name } = req.body;
  const user = await User.findOne({ login_name: login_name });
  try {
    if (user) {
      res.status(200).json(user);
    } else res.status(404).json({ message: "Not found" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/logout", async (req, res) => {
  // logout
});
module.exports = router;
