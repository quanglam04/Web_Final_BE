const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

// bình luận
router.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  try {
    const commentSchema = {
      comment: request.body.comment,
      date_time: request.body.date_time,
      user_id: request.body.userLogin._id,
    };
    if (request.session.userId) {
      const photo = await Photo.findOneAndUpdate(
        { _id: request.params.photo_id },
        {
          $push: { comments: commentSchema },
        },
        { new: true }
      );

      response.status(200).json(photo);
    } else {
      response.status(401).json({ message: "Vui lòng đăng nhập" });
    }
  } catch (e) {
    response.status(500).json({ message: "Lỗi Server" });
  }
});

// lấy tất cả bình luận hiện có
router.get("/", async (request, response) => {});

module.exports = router;
