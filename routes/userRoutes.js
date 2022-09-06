const express = require("express");
const {
  followUser,
  unfollowUser,
  updateUserPassword,
  updateUser,
  getCurrentUser,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authentication");

const router = express.Router();

router.route("/follow").post(authenticateUser, followUser);
router.route("/unfollow").post(authenticateUser, unfollowUser);
router.route("/updatePassword").put(authenticateUser, updateUserPassword);
router.route("/updateUser").put(authenticateUser, updateUser);
router.route("/currentUser").get(authenticateUser, getCurrentUser);

module.exports = router;
