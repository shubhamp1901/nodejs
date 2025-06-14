const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClientSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter the name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter the email"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please enter the email"],
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("clients", ClientSchema);
module.exports = { Client };
