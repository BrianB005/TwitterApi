const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    tweet: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    replyingTo: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      maxlength: [600, "A comment can't be longer than 600 characters"],
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

module.exports = mongoose.model("Comment", CommentSchema);
