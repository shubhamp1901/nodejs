const asyncHandler = require("express-async-handler");
const { User } = require("../models/users");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ success: true, data: users });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  console.log(req.files, 'files')
  console.log(req.images, 'images')

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please add at least one image file");
  }

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    res.status(400);
    throw new Error("User with email id exists");
  }

  const newUser = await User.create({
    name,
    email,
    phone,
    images: req.images || [],
  });
  res.status(201).json({
    success: true,
    message: "Successfully created new user",
    data: newUser,
  });
});

module.exports = {
  getAllUsers,
  createUser,
};
