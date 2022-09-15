const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const { userTokenPayload, createJWT } = require("../utils");
const CustomError = require("../errors");

const checkUserDetails = async (req, res) => {
  if (req.body.phoneNumber != null) {
    const phoneNumber = req.body.phoneNumber;
    const numberAlreadyExists = await User.findOne({ phoneNumber });

    if (numberAlreadyExists) {
      throw new CustomError.BadRequestError("Phone number already taken");
    }
  } else if (req.body.email != null) {
    const emailAlreadyExists = await User.findOne({ email: req.body.email });

    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already taken!");
    }
  } else if (req.body.username != null) {
    const usernameAlreadyExists = await User.findOne({
      username: req.body.username,
    });
    if (usernameAlreadyExists) {
      throw new CustomError.BadRequestError("Username already taken");
    }
  }
  res.status(200).json("User details are valid");
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  const tokenUser = userTokenPayload(user);
  const token = createJWT({ payload: tokenUser });
  const { password, email, phoneNumber, ...others } = user._doc;
  res.status(200).json({ user: others, token });
};

const login = async (req, res) => {
  let user;
  if (req.body.email == null) {
    const phoneNumber = req.body.phoneNumber;
    user = await User.findOne({ phoneNumber }).select("+password");
  } else {
    user = await User.findOne({ email: req.body.email }).select("+password");
  }
  if (!user) {
    throw new CustomError.UnauthenticatedError("User doesn't exist");
  }
  const isPasswordCorrect = await user.comparePassword(req.body.password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  const tokenUser = userTokenPayload(user);

  const token = createJWT({ payload: tokenUser });

  // const { password, email, phoneNumber, ...others } = user._doc;
  res.status(200).json({ user, token });
};
const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "user logged out successfully.!" });
};

module.exports = {
  createUser,
  login,
  logout,
  checkUserDetails,
};
