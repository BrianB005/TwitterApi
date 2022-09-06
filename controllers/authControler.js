const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const { userTokenPayload, createJWT } = require("../utils");
const CustomError = require("../errors");

const createUser = async (req, res) => {
  const email = req.body.email;

  const username = req.body.username;
  if (email == null) {
    const phoneNumber = req.body.phoneNumber;
    const numberAlreadyExists = await User.findOne({ phoneNumber });

    if (numberAlreadyExists) {
      throw new CustomError.BadRequestError("Phone number already taken");
    }
  } else {
    const emailAlreadyExists = await User.findOne({ email });

    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already taken!");
    }
  }

  const usernameAlreadyExists = await User.findOne({ username });

  if (usernameAlreadyExists) {
    throw new CustomError.BadRequestError("Username already taken");
  }

  const user = await User.create(req.body);
  const tokenUser = userTokenPayload(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let user;
  if (req.body.email == null) {
    const phoneNumber = req.body.phoneNumber;
    user = await User.findOne({ phoneNumber });
  } else {
    user = await User.findOne({ email });
  }
  if (!user) {
    throw new CustomError.UnauthenticatedError("User doesn't exist");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  const tokenUser = userTokenPayload(user);

  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token });
};
const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "user logged out successfully.!" });
};

module.exports = {
  createUser,
  login,
  logout,
};
