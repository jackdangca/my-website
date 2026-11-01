const express = require('express');
const { body } = require('express-validator');
const {
  getQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
  deleteAllQualifications,
} = require('../controllers/qualificationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules reused for create and update.
const qualificationValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('completionDate').isISO8601().withMessage('A valid completion date is required'),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
];

// GET /api/qualifications — all records
router.get('/', getQualifications);

// DELETE /api/qualifications — remove all (admin only, test env)
router.delete('/', protect, admin, deleteAllQualifications);

// GET /api/qualifications/:id — one record
router.get('/:id', getQualificationById);

// POST /api/qualifications — create a record (admin only)
router.post('/', protect, admin, qualificationValidation, createQualification);

// PUT /api/qualifications/:id — update a record (admin only)
router.put('/:id', protect, admin, qualificationValidation, updateQualification);

// DELETE /api/qualifications/:id — remove one record (admin only)
router.delete('/:id', protect, admin, deleteQualification);

module.exports = router;
