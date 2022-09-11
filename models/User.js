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
      default:
        "data:image/jpeg;base64,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",
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
