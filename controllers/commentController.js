const Comment = require("../models/Comment");
const Tweet = require("../models/Tweet");

const createComment = async (req, res) => {
  const tweetToComment = await Tweet.findById(req.params.tweetId).populate(
    "user"
  );

  req.body.tweet = req.params.tweetId;
  req.body.user = req.user.userId;

  const comment = await Comment.create(req.body);

  await comment.updateOne({
    $addToSet: { replyingTo: tweetToComment.user.username },
  });
  await tweetToComment.updateOne({ $addToSet: { comments: comment._id } });

  res.status(200).json(tweetToComment);
};
const createCommentOnComment = async (req, res) => {
  const commentToComment = await Comment.findById(
    req.params.commentId
  ).populate("user");

  // req.body.replyingTo = tweetToComment.user.username;
  const commentTweetAuthor = commentToComment.replyingTo[0];

  req.body.tweet = req.params.commentId;

  req.body.user = req.user.userId;

  const comment = await Comment.create(req.body);

  await comment.updateOne({
    $addToSet: { replyingTo: commentTweetAuthor },
  });
  await comment.updateOne({
    $addToSet: { replyingTo: commentToComment.user.username },
  });

  await commentToComment.updateOne({ $addToSet: { comments: comment._id } });

  res.status(200).json(comment);
};
const getATweetsComments = async (req, res) => {
  const tweetComments = await Comment.find({
    tweet: req.params.tweetId,
  }).populate("user");

  res.status(200).json(tweetComments);
};
const deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json("Comment deleted successfully");
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment.likes.includes(req.user.userId)) {
      await comment.updateOne({
        $push: { likes: req.user.userId },
      });
      res.status(200).json(comment);
    } else {
      await comment.updateOne({
        $pull: { likes: req.user.userId },
      });
      res.status(200).json(comment);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const retweetComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment.retweets.includes(req.user.userId)) {
    await comment.updateOne({
      $push: { retweets: req.user.userId },
    });
    res.status(200).json(comment);
  } else {
    await comment.updateOne({
      $pull: { retweets: req.user.userId },
    });
    res.status(200).json(comment);
  }
};

const getACommentComments = async (req, res) => {
  const comments = await Comment.find({ tweet: req.params.commentId });

  res.status(200).json(comments);
};

module.exports = {
  createComment,
  deleteComment,
  getATweetsComments,
  createCommentOnComment,
  likeComment,
  retweetComment,
  getACommentComments,
};
