const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");

const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ success: true, data: users });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "No User Found" });
  }

  res.status(200).json({
    success: true,
    message: "Successfully updated the user",
    data: user,
  });
});

const getUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).lean();

  if (!user) {
    return res.status(404).json({ success: false, message: "No User Found" });
  }

  res.status(200).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOneAndDelete({ _id: userId });

  if (!user) {
    return res.status(404).json({ success: false, message: "No User Found" });
  }

  res.status(200).json({
    success: true,
    message: "Successfully deleted the user",
  });
});

module.exports = {
  allUsers,
  updateUser,
  getUser,
  deleteUser,
};
