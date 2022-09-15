const { Router } = require("express");
const express = require("express");
const {
  followUser,
  unfollowUser,
  updateUserPassword,
  updateUser,
  getCurrentUser,
  getUser,
  getUserFollowers,
  getUserFollowing,
  getCurrentUserFollowing,
  getCurrentUserFollowers,
  getAllUsers,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authentication");

const router = express.Router();

router.route("/follow/:userId").post(authenticateUser, followUser);
router.route("/unfollow/:userId").post(authenticateUser, unfollowUser);
router.route("/updatePassword").put(authenticateUser, updateUserPassword);
router.route("/updateUser").put(authenticateUser, updateUser);
router.route("/currentUser").get(authenticateUser, getCurrentUser);
router.route("/get/:userId").get(getUser);

router.route("/getFollowers/:userId").get(authenticateUser, getUserFollowers);
router.route("/getFollowing/:userId").get(authenticateUser, getUserFollowing);

router.route("/getFollowing").get(authenticateUser, getCurrentUserFollowing);
router.route("/getFollowers").get(authenticateUser, getCurrentUserFollowers);

router.route("/").get(authenticateUser, getAllUsers);

module.exports = router;
