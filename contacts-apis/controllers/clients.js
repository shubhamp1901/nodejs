const asyncHandler = require("express-async-handler");
const { Client } = require("../models/clients");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerClient = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const clientExists = await Client.findOne({ username, email });
  if (clientExists) {
    res.status(400);
    throw new Error("Client already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await Client.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "New client created successfully",
    data: client,
  });
});

const loginClient = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const client = await Client.findOne({ username });
  if (!client) {
    res.status(400);
    throw new Error("Client with username does not exist");
  }

  const isMatch = await bcrypt.compare(password, client.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid Credentials");
  }

  const token = jwt.sign(
    {
      user: {
        username: client.username,
        email: client.email,
        id: client._id,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(200).json({success: true, data: client, token: token})
});

const currentClient = asyncHandler(async (req, res) => {
    const {id} = req.user
    const client = await Client.findOne({_id: id})
    res.status(200).json({success: true, data: client})
});

module.exports = {
  registerClient,
  loginClient,
  currentClient,
};
