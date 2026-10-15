const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

/**
 * @desc   Get all contacts
 * @route  GET /api/contacts
 */
const getContacts = async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
};

/**
 * @desc   Get a single contact
 * @route  GET /api/contacts/:id
 */
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a contact
 * @route  POST /api/contacts
 */
const createContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a contact
 * @route  PUT /api/contacts/:id
 */
const updateContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a contact
 * @route  DELETE /api/contacts/:id
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    await contact.deleteOne();
    res.json({ success: true, message: 'Contact removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete ALL contacts (admin only, test environments)
 * @route  DELETE /api/contacts
 * @access Private/Admin
 */
const deleteAllContacts = async (req, res) => {
  const result = await Contact.deleteMany({});
  res.json({ success: true, message: `${result.deletedCount} contacts removed` });
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
};
