const express = require("express");
const {
  createComment,
  deleteComment,
  getATweetsComments,
  likeComment,
  retweetComment,
  createCommentOnComment,
  getACommentComments,
} = require("../controllers/CommentController");
const { authenticateUser } = require("../middlewares/authentication");
const router = express.Router();

router.route("/create/:tweetId").post(authenticateUser, createComment);
router.route("/delete").post(authenticateUser, deleteComment);
router.route("/:tweetId").get(getATweetsComments);
router.route("/like/:commentId").post(authenticateUser, likeComment);
router.route("/retweet/:commentId").post(authenticateUser, retweetComment);
router
  .route("/comment/:commentId")
  .post(authenticateUser, createCommentOnComment);

router.route("/getComments/:commentId").get(getACommentComments);

module.exports = router;
