const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const RegisterUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Check if user with email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(409)
      .json({ success: false, message: "User with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role,
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(409)
      .json({ success: false, message: "User with this email does not exist" });
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res
      .status(409)
      .json({ success: false, message: "Invalid Credentials" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: user,
    token,
  });
});

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "User doesn't exist" });

  const secret = process.env.SECRET_KEY + user.password;
  const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "1h",
  });

  const resetURL = `http://localhost:5000/api/auth/reset-password?id=${user._id}&token=${token}`;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "pshubham1886@gmail.com",
      pass: "oohu dsza elph vyzi",
    },
  });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset link sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.query;
  const { password } = req.body;

  const user = await User.findOne({ _id: id });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User not exists!" });
  }

  const secret = process.env.SECRET_KEY + user.password;

  const verify = jwt.verify(token, secret);

  const encryptedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        password: encryptedPassword,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: `${updatedUser.firstName}, Your Password has been reset successfully`,
  });
});

module.exports = {
  RegisterUser,
  LoginUser,
  resetPassword,
  logoutUser,
  requestPasswordReset
};
