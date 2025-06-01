const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

// api lất tất cả danh sách người dùng
router.get("/list", async (request, response) => {
  try {
    if (request.session.userId) {
      const listUser = await User.find({});
      const listUserDTO = listUser.map((user) => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      }));
      response.status(200).json(listUserDTO);
    } else {
      response.status(401).json({ message: "Vui lòng đăng nhập" });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});

// api xem chi tiết thông tin người dùng
router.get("/:id", async (request, response) => {
  try {
    if (request.session.userId) {
      const userDetail = await User.findById(request.params.id);
      response.status(200).json(userDetail);
    } else {
      response.status(401).json({ message: "Vui lòng đăng nhập" });
    }
  } catch (error) {
    response.status(400).json("Tham số ID không hợp lệ");
  }
});

// api đếm số lượng ảnh của người có ID
router.get("/numberOfPhotos/:id", async (request, response) => {
  const userId = request.params.id;
  try {
    if (request.session.userId) {
      const listPhoto = await Photo.find({});
      let numberOfPhoto = 0;

      listPhoto.forEach((photo) => {
        if (photo.user_id.toString() === userId) {
          numberOfPhoto = numberOfPhoto + 1;
        }
      });
      response.status(200).json(numberOfPhoto);
    } else {
      response.status(401).json({ message: "Vui lòng đăng nhập" });
    }
  } catch (error) {
    response.status(400).json("Tham số ID không hợp lệ");
  }
});

// api đếm số lượng bình luận của người dùng có ID

// api trả về các bức ảnh của người dùng có ID = id
router.get("/photosOfUser/:id", async (request, response) => {
  try {
    if (request.session.userId) {
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
    } else {
      response.status(401).json({ message: "Vui lòng đăng nhập" });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});

module.exports = router;
