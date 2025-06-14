const express = require("express");
const connectDB = require("./db/connect");
require("dotenv").config();
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const logger = require('morgan')
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(logger('dev'))
app.use(express.json());
// username=shubham&email=shubham%40example.com&password=123456&role=user
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
// start the server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
