const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();
const jwt = require("jsonwebtoken");

// api login
router.post("/", async (req, res) => {
  const { login_name, pass_word } = req.body;

  try {
    const user = await User.findOne({
      login_name: login_name,
      pass_word: pass_word,
    });

    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
          login_name: user.login_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          _id: user._id,
          login_name: user.login_name,
          full_name: `${user.first_name} ${user.last_name}`,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// api register
router.post("/register", async (req, res) => {
  const user = {
    login_name: req.body.login_name,
    pass_word: req.body.pass_word,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    location: req.body.location,
    description: req.body.description,
    occupation: req.body.occupation,
  };
  try {
    const userInDb = await User.findOne({
      login_name: user.login_name,
    });
    if (userInDb) {
      res.status(400).json({ message: "User đã tồn tại trong hệ thống" });
    } else {
      const newUser = new User(user);
      await newUser.save();
      res.status(200).json({
        message: "Đăng ký thành công. Nhấn để trở về trang chủ",
        user: {
          login_name: user.login_name,
          first_name: user.login_name,
          last_name: user.last_name,
        },
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server" });
  }
});

// logout
router.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
