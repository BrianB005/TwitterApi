const mongoose = require("mongoose");
const TweetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: [500, "A tweet can't be longer than 500 characters"],
    },
    images: {
      type: Array,
    },
    comments: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    retweets: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", TweetSchema);
