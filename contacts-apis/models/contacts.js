const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema(
  {
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Client"
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Please add the name"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please add the email"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please add the phone number"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("contacts", ContactSchema);

module.exports = { Contact };
