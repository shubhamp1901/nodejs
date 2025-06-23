const express = require("express");
const connectDB = require("./db/connect");
require("dotenv").config();
const logger = require('morgan')
const cors = require('cors');
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const blogRoutes = require('./routes/blog');
const { connectRedis } = require("./redis/redisClient");

connectDB()
const app = express()
connectRedis();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Middleware
app.use(logger("dev")); // Use "dev" mode for better output
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
