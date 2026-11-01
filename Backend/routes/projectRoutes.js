const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules reused for create and update.
const projectValidation = [
  body('id')
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Project id must be a lowercase slug'),
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('completionDate')
    .isISO8601()
    .withMessage('A valid project completion date is required'),
  body('image').notEmpty().withMessage('Image is required'),
  body('alt').notEmpty().withMessage('Image alt text is required').isLength({ max: 300 }),
  body('role').notEmpty().withMessage('Role is required').isLength({ max: 200 }),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('techStack')
    .isArray({ min: 1 })
    .withMessage('Tech stack must include at least one technology'),
  body('techStack.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Technologies must be non-empty strings'),
  body('outcome').notEmpty().withMessage('Outcome is required').isLength({ max: 2000 }),
];

// GET /api/projects — all records
router.get('/', getProjects);

// DELETE /api/projects — remove all (admin only, test env)
router.delete('/', protect, admin, deleteAllProjects);

// GET /api/projects/:id — one record
router.get('/:id', getProjectById);

// POST /api/projects — create a record (admin only)
router.post('/', protect, admin, projectValidation, createProject);

// PUT /api/projects/:id — update a record (admin only)
router.put('/:id', protect, admin, projectValidation, updateProject);

// DELETE /api/projects/:id — remove one record (admin only)
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
