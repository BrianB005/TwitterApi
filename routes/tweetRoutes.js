const express = require("express");
const {
  createTweet,
  getTimelineTweets,
  getCurrentUserLikedTweets,
  getCurrentUserTweets,
  getCurrentUserTweetsAndComments,
  likeTweet,
  retweetTweet,
  getCurrentUserMediaTweets,
  getUserTweets,
  getUserLikedTweets,
  getUserTweetsAndComments,
  getUserMediaTweets,
} = require("../controllers/tweetsController");
const { authenticateUser } = require("../middlewares/authentication");

const router = express.Router();

router.route("/create").post(authenticateUser, createTweet);
router.route("/").get(authenticateUser, getTimelineTweets);
router
  .route("/getCurrentUserLikedTweets")
  .get(authenticateUser, getCurrentUserLikedTweets);
router
  .route("/getCurrentUserTweets")
  .get(authenticateUser, getCurrentUserTweets);
router
  .route("/getCurrentUserTweetsAndComments")
  .get(authenticateUser, getCurrentUserTweetsAndComments);

router
  .route("/getCurrentUserMediaTweets")
  .get(authenticateUser, getCurrentUserMediaTweets);

router
  .route("/getUserLikedTweets/:userId")
  .get(authenticateUser, getUserLikedTweets);
router.route("/getUserTweets/:userId").get(authenticateUser, getUserTweets);
router
  .route("/getUserTweetsAndComments/:userId")
  .get(authenticateUser, getUserTweetsAndComments);

router
  .route("/getUserMediaTweets/:userId")
  .get(authenticateUser, getUserMediaTweets);

router.route("/like/:tweetId").post(authenticateUser, likeTweet);
router.route("/retweet/:tweetId").post(authenticateUser, retweetTweet);

module.exports = router;
