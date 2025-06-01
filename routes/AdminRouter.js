const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { login_name, pass_word } = req.body;
  const user = await User.findOne({
    login_name: login_name,
    pass_word: pass_word,
  });
  try {
    if (user) {
      req.session.userId = user._id;
      res.status(200).json(user);
    } else res.status(401).json({ message: "Invalid credentials" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

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
    console.log("login_name: ", user.login_name);

    if (userInDb) {
      // bị trùng
      console.log(userInDb);

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

router.post("/logout", async (req, res) => {
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
