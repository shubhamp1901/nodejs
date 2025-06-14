const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const asyncHandler = require("express-async-handler");
const generateRandom4DigitNumber = require("../utils/randomNumGenerator");

const sendWelcomeEmail = asyncHandler(async (req, res) => {
  const { to, userName } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Recipient email is required" });
  }

  const html = pug.renderFile(path.join(__dirname, "../views/welcome.pug"), {
    name: userName,
    otp,
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "pshubham1886@gmail.com",
      pass: "oohu dsza elph vyzi",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Node Class New Lectures" <pshubham1886@gmail.com>`,
      to,
      subject: "Welcome to the Node.js Course!",
      html,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Email failed to send" });
  }
});

const resetEmail = asyncHandler(async (req, res) => {
  const { to, userName } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Recipient email is required" });
  }

  const otp = generateRandom4DigitNumber();

  const html = pug.renderFile(
    path.join(__dirname, "../views/reset-password.pug"),
    {
      name: userName,
      otp,
    }
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "pshubham1886@gmail.com",
      pass: "oohu dsza elph vyzi",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Password Reset" <pshubham1886@gmail.com>`,
      to,
      subject: "Password Reset",
      html,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Email failed to send" });
  }
});

module.exports = { sendWelcomeEmail, resetEmail };
