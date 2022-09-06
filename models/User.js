const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide a name"],
    },
    username: {
      type: String,
      required: [true, "You must provide a username"],
      unique: [true, "This username already exists"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an  email address"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    phoneNumber: {
      type: Number,
      unique: [true, "This phone number already exists"],
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
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
