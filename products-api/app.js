const express = require("express");
require("dotenv").config();
const productRoutes = require("./routes/products");
const connectDB = require("./db/connect");

connectDB();
const app = express();
app.use(express.json());
PORT = process.env.PORT || 5000;

// routes
app.use("/api/products", productRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
