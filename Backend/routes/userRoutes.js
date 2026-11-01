const express = require('express');
const { body } = require('express-validator');
const { registerUser } = require('../controllers/authController');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const registrationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const updateValidation = [
  body('name').optional().isLength({ max: 100 }).withMessage('Name too long'),
  body('email').optional().isEmail().withMessage('A valid email is required'),
];

// POST /api/users — register a regular user (same contract as /api/auth/register)
router.post('/', registrationValidation, registerUser);

// All user routes require authentication.
router.use(protect);

// GET /api/users — all users (private)
router.get('/', getUsers);

// DELETE /api/users — remove all (admin only, test env)
router.delete('/', admin, deleteAllUsers);

// GET /api/users/:id — one user (private)
router.get('/:id', getUserById);

// PUT /api/users/:id — update a user (private)
router.put('/:id', updateValidation, updateUser);

// DELETE /api/users/:id — remove a user (private/admin)
router.delete('/:id', admin, deleteUser);

module.exports = router;
