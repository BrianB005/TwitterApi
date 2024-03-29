const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide a name"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    username: {
      type: String,
      required: [true, "You must provide a username"],
      unique: [true, "This username already exists"],
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
      select: false,
    },
    phoneNumber: {
      type: Number,
      unique: [true, "This phone number already exists"],
      select: false,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "You must provide your date of birth"],
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    topics: {
      type: Array,
      required: true,
    },
    profilePic: {
      type: String,
      default: "download.png",
    },
    headerPic: {
      type: String,
      default: "image3.jpg",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },

    password: {
      type: String,
      required: [true, "You must provide a password!"],
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre("remove", async function (next) {
  await this.model("Tweet").deleteMany({ user: this._id });
  await this.model("Comment").deleteMany({ user: this._id });
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
