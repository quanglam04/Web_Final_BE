const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Photo = require("../db/photoModel");
const router = express.Router();

// Đường dẫn tới thư mục images trong FE
const feImagePath = path.join(__dirname, "../../FE/public/images");

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, feImagePath); // Ghi trực tiếp vào FE/src/images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage: storage });

// bình luận
router.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  try {
    const commentSchema = {
      comment: request.body.comment,
      date_time: request.body.date_time,
      user_id: request.body.userLogin._id,
    };
    const photo = await Photo.findOneAndUpdate(
      { _id: request.params.photo_id },
      {
        $push: { comments: commentSchema },
      },
      { new: true }
    );

    response.status(200).json(photo);
  } catch (e) {
    response.status(500).json({ message: "Lỗi Server" });
  }
});

// upload ảnh
router.post("/new", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    const photo = new Photo({
      file_name: file.filename,
      date_time: req.body.date_time,
      user_id: req.body.user_id,
      comments: [],
    });

    await photo.save();

    res.status(200).json({
      message: "Upload thành công",
      file_name: file.filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload thất bại" });
  }
});

module.exports = router;
