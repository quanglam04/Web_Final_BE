const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// api lất tất cả danh sách người dùng
router.get("/list", async (request, response) => {
  try {
    const listUser = await User.find({});
    const listUserDTO = listUser.map((user) => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    }));
    response.status(200).json(listUserDTO);
  } catch (error) {
    response.status(500).json({ error });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }).select(
      "-pass_word"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// api xem chi tiết thông tin người dùng
router.get("/:id", async (request, response) => {
  const user = await User.findOne({ _id: request.user.userId });
  try {
    const userDetail = await User.findById(request.params.id);
    response.status(200).json(userDetail);
  } catch (error) {
    response.status(4400).json("Tham số ID không hợp lệ");
  }
});

// api đếm số lượng ảnh của người có ID
router.get("/numberOfPhotos/:id", async (request, response) => {
  const userId = request.params.id;
  try {
    const listPhoto = await Photo.find({});
    let numberOfPhoto = 0;

    listPhoto.forEach((photo) => {
      if (photo.user_id.toString() === userId) {
        numberOfPhoto = numberOfPhoto + 1;
      }
    });
    response.status(200).json(numberOfPhoto);
  } catch (error) {
    response.status(400).json("Tham số ID không hợp lệ");
  }
});

// api đếm số lượng bình luận của người dùng có ID

// api trả về các bức ảnh của người dùng có ID = id
router.get("/photosOfUser/:id", async (request, response) => {
  try {
    const listPhotoByUserID = await Photo.find({
      user_id: request.params.id,
    });
    const listUser = await User.find({});

    const userMap = {};
    listUser.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const result = listPhotoByUserID.map((photo) => {
      const updatedComments = photo.comments.map((comment) => {
        const userObj = userMap[comment.user_id.toString()];
        return {
          ...comment._doc,
          user: userObj
            ? {
                _id: userObj._id,
                first_name: userObj.first_name,
                last_name: userObj.last_name,
              }
            : null,
          user_id: undefined,
        };
      });

      return {
        ...photo._doc,
        comments: updatedComments,
      };
    });

    response.status(200).json(result);
  } catch (error) {
    response.status(500).json({ error });
  }
});

// lấy thông tin user từ userId trong cookies

module.exports = router;
