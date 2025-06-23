const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`DB Connected - ${connect.connection.name}`);
  } catch (error) {
    console.log("Failed to Connect to DB!!");
  }
};

module.exports = connectDB;
