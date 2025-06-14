const express = require("express");
const path = require('path');
const connectDB = require("./db/connect");
require("dotenv").config();
const logger = require("morgan");
const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");
const userRoutes = require("./routes/users");
const emailRoutes = require('./routes/email')
const multerErrorHandler = require("./middlewares/multer-error");

connectDB();
const app = express();

// middlewares
app.use(logger("dev"));
app.use(express.json());
// app.use("uploads/", express.static("uploads"));
app.use('uploads/', express.static(path.join(__dirname, 'uploads')));

// routes

app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes)
app.use(notFound);
// Handles server/internal errors centrally.
app.use(errorHandler); 
// app.use(multerErrorHandler)
// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
