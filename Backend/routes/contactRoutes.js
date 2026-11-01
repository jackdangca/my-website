const express = require('express');
const { body } = require('express-validator');
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules reused for create and update.
const contactValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 }),
];

// Contact submissions contain personal information; readers must be signed in.
router.get('/', protect, getContacts);

// DELETE /api/contacts — remove all (admin only, test env)
router.delete('/', protect, admin, deleteAllContacts);

// GET /api/contacts/:id — one record
router.get('/:id', protect, getContactById);

// POST /api/contacts — create a record
router.post('/', contactValidation, createContact);

// PUT /api/contacts/:id — update a record (admin only)
router.put('/:id', protect, admin, contactValidation, updateContact);

// DELETE /api/contacts/:id — remove one record (admin only)
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
