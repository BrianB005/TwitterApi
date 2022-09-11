const User = require("../models/User");

const followUser = async (req, res) => {
  if (req.user.userId === req.body.userId) return;
  const userToFollow = await User.findById(req.body.userId);

  const currentUser = await User.findById(req.user.userId);

  await currentUser.updateOne({
    $addToSet: { following: req.body.userId },
  });

  await userToFollow.updateOne({
    $addToSet: { followers: req.user.userId },
  });
  res.status(200).json("User followed successfully");
};

const unfollowUser = async (req, res) => {
  const userToUnFollow = await User.findById(req.body.userId);

  const currentUser = await User.findById(req.user.userId);

  await userToUnFollow.updateOne({ $pull: { followers: req.user.userId } });
  await currentUser.updateOne({ $pull: { following: req.body.userId } });

  res.status(200).json("User unfollowed successfully");
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide both old and new password"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Incorrect password!");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password updated." });
};
const updateUser = async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
    runValidators: true,
  });
  authorizeUser(req.user, user._id);
  const tokenUser = userTokenPayload(user);

  const token = createJWT({ payload: tokenUser });

  const { password, email, phoneNumber, ...others } = user._doc;
  res.status(StatusCodes.CREATED).json({ user: others, token: token });
};

const getCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const { password, email, phoneNumber, ...others } = currentUser._doc;
  res.status(200).json({ user: others });
};
const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  const { password, email, phoneNumber, ...others } = user._doc;
  res.status(200).json({ user: others });
};

module.exports = {
  updateUser,
  updateUserPassword,
  followUser,
  unfollowUser,
  getCurrentUser,
  getUser,
};
