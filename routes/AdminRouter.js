const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("Call APi LOGIN");
  const { login_name } = req.body;
  const user = await User.findOne({ login_name: login_name });
  try {
    if (user) {
      req.session.userId = user._id;
      res.status(200).json(user);
    } else res.status(401).json({ message: "Invalid credentials" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/logout", async (req, res) => {
  console.log("call api logout");

  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Logout failed" });
    } else {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out" });
    }
  });
});

module.exports = router;
