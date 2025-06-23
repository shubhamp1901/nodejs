const express = require("express");
const connectDB = require("./db/connect");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const blogRoutes = require('./routes/blog')

connectDB()
const app = express()


app.use(cookieParser());
// middlewares
app.use(express.json());

// routes
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
