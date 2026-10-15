const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const updateValidation = [
  body('name').optional().isLength({ max: 100 }).withMessage('Name too long'),
  body('email').optional().isEmail().withMessage('A valid email is required'),
];

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
