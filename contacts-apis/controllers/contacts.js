// whenever we interact with mongoose we get promise to resolve that promise we use async/await and use try catch in each function to catch errors
const asyncHandler = require("express-async-handler");
const { Contact } = require("../models/contacts");

// whenever exception is occured asyncHandler will pass it to error-handler
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ client_id: req.user.id });
  res.status(200).json({ success: true, data: contacts });
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const newContact = await Contact.create({
    name,
    email,
    phone,
    client_id: req.user.id,
  });
  res.status(201).json({
    success: true,
    message: "Successfully created new contact",
    data: newContact,
  });
});

const getContact = asyncHandler(async (req, res) => {
  const { id: contactId } = req.params;

  // Check if the ID is a valid Mongo ObjectId

  const contact = await Contact.findOne({ _id: contactId });
  if (!contact) {
    res.status(404);
    throw new Error("No Contact Found");
  }
  res.status(200).json({ success: true, data: contact });
});

const updateContact = asyncHandler(async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (contact.client_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User does not have permission to update this document");
  }

  if (!contact) {
    res.status(404);
    throw new Error("No Contact Found");
  }
  res.status(200).json({
    success: true,
    message: "Successfully updated the contact",
    data: contact,
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOneAndDelete({ _id: contactId });

  if (!contact) {
    res.status(404);
    throw new Error("No Contact Found");
  }

  if (contact.client_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User does not have permission to update this document");
  }

  res.status(200).json({
    success: true,
    message: "Successfully deleted the contact",
  });
});

module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
