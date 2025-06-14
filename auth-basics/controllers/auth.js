const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    // Salt is a random string added to the password before hashing. It makes each hash unique, even if two users have the same password
    // That’s the salt rounds or cost factor.
    // It controls how many times the hashing algorithm runs.
    // Higher number = more secure but slower. 10 is a good balance between security and performance
    const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = new User({
    //   email,
    //   username,
    //   password: hashedPassword,
    //   role,
    // });

    // await newUser.save();

    const userExists = await User.exists({ username, email });

    if (userExists) {
      return res
        .status(400)
        .send({ success: false, message: "User already exists" });
    }

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      //   data: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // lean() is a method you can chain to a Mongoose query to return plain JavaScript objects instead of Mongoose documents.
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    // jwt.sign(payload, secret, options)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000, // 1 hour
    });

    delete user.password;
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      cookie: req.cookies.token,
      token,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  register,
  login,
};
