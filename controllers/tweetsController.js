const Tweet = require("../models/Tweet");
const User = require("../models/User");

const Comment = require("../models/Comment");
const createTweet = async (req, res) => {
  req.body.user = req.user.userId;
  const tweet = await Tweet.create(req.body).populate("user", {
    name: 1,
    username: 1,
    profilePic: 1,
  });
  res.status(200).json(tweet);
};

const getCurrentUserLikedTweets = async (req, res) => {
  const allTweets = await Tweet.find()
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const likedTweets = allTweets.filter((tweet) =>
    tweet.likes.includes(req.user.userId)
  );
  const allComments = await Comment.find()
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const likedComments = allComments.filter((comment) =>
    comment.likes.includes(req.user.userId)
  );

  res.status(200).json(likedTweets.concat(likedComments));
};
const getUserLikedTweets = async (req, res) => {
  const allTweets = await Tweet.find()
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const likedTweets = allTweets.filter((tweet) =>
    tweet.likes.includes(req.params.userId)
  );

  const allComments = await Comment.find()
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const likedComments = allComments.filter((comment) =>
    comment.likes.includes(req.params.userId)
  );

  res.status(200).json(likedTweets.concat(likedComments));
};

const getCurrentUserTweets = async (req, res) => {
  const userTweets = await Tweet.find({ user: req.user.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const allTweets = await Tweet.find()
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const retweetedTweets = allTweets.filter((tweet) =>
    tweet.retweets.includes(req.user.userId)
  );

  const tweetsAndRetweets = userTweets.concat(retweetedTweets);
  res.status(200).json(tweetsAndRetweets);
};
const getUserTweets = async (req, res) => {
  const userTweets = await Tweet.find({ user: req.params.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const allTweets = await Tweet.find()
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const retweetedTweets = allTweets.filter((tweet) =>
    tweet.retweets.includes(req.params.userId)
  );

  const tweetsAndRetweets = userTweets.concat(retweetedTweets);

  res.status(200).json(tweetsAndRetweets);
};

const getCurrentUserTweetsAndComments = async (req, res) => {
  const currentUserComments = await Comment.find({ user: req.user.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const currentUserTweets = await Tweet.find({ user: req.user.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const tweetsAndComments = currentUserComments.concat(currentUserTweets);
  res.status(200).json(tweetsAndComments);
};

const getUserTweetsAndComments = async (req, res) => {
  const currentUserComments = await Comment.find({ user: req.params.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const currentUserTweets = await Tweet.find({ user: req.params.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");

  res.status(200).json(currentUserComments.concat(currentUserTweets));
};

const likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId).populate("user", {
      name: 1,
      username: 1,
      profilePic: 1,
    });
    if (!tweet.likes.includes(req.user.userId)) {
      await tweet.updateOne({
        $push: { likes: req.user.userId },
      });
      res.status(200).json(tweet);
    } else {
      await tweet.updateOne({
        $pull: { likes: req.user.userId },
      });
      res.status(200).json(tweet);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const retweetTweet = async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId).populate("user", {
    name: 1,
    username: 1,
    profilePic: 1,
  });
  if (!tweet.retweets.includes(req.user.userId)) {
    await tweet.updateOne({
      $push: { retweets: req.user.userId },
    });
    res.status(200).json({ tweet });
  } else {
    await tweet.updateOne({
      $pull: { retweets: req.user.userId },
    });
    res.status(200).json(tweet);
  }
};

const getTimelineTweets = async (req, res) => {
  const userId = req.user.userId;
  const currentUser = await User.findById(userId);
  const userTweets = await Tweet.find({ user: userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const currentUserFollowingTweets = await Promise.all(
    currentUser.following.map((followingId) => {
      return Tweet.find({ user: followingId })
        .populate("user", { name: 1, username: 1, profilePic: 1 })
        .sort("-createdAt");
    })
  );
  // const userFollowersLikedAndRetweetedTweets = await Promise.all();

  const timelineTweets = userTweets.concat(...currentUserFollowingTweets);

  res.status(200).json(timelineTweets);
};

const getCurrentUserMediaTweets = async (req, res) => {
  const userTweets = await Tweet.find({ user: req.user.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const mediaTweets = userTweets.filter((tweet) => tweet.images.length !== 0);

  res.status(200).json(mediaTweets);
};
const getUserMediaTweets = async (req, res) => {
  const userTweets = await Tweet.find({ user: req.params.userId })
    .populate("user", { name: 1, username: 1, profilePic: 1 })
    .sort("-createdAt");
  const mediaTweets = userTweets.filter((tweet) => tweet.images.length !== 0);

  res.status(200).json(mediaTweets);
};

module.exports = {
  createTweet,
  likeTweet,
  retweetTweet,
  getTimelineTweets,
  getCurrentUserLikedTweets,
  getCurrentUserTweets,
  getCurrentUserTweetsAndComments,
  getCurrentUserMediaTweets,
  getUserTweets,
  getUserTweetsAndComments,
  getUserLikedTweets,
  getUserMediaTweets,
};
