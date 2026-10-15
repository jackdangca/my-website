const Qualification = require('../models/Qualification');
const { validationResult } = require('express-validator');

/**
 * @desc   Get all qualifications
 * @route  GET /api/qualifications
 */
const getQualifications = async (req, res) => {
  const qualifications = await Qualification.find({}).sort({ completionDate: -1 });
  res.json({
    success: true,
    count: qualifications.length,
    data: qualifications,
  });
};

/**
 * @desc   Get a single qualification
 * @route  GET /api/qualifications/:id
 */
const getQualificationById = async (req, res, next) => {
  try {
    const qualification = await Qualification.findById(req.params.id);
    if (!qualification) {
      return res.status(404).json({ success: false, message: 'Qualification not found' });
    }
    res.json({ success: true, data: qualification });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a qualification
 * @route  POST /api/qualifications
 */
const createQualification = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const qualification = await Qualification.create(req.body);
    res.status(201).json({ success: true, data: qualification });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a qualification
 * @route  PUT /api/qualifications/:id
 */
const updateQualification = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const qualification = await Qualification.findById(req.params.id);
    if (!qualification) {
      return res.status(404).json({ success: false, message: 'Qualification not found' });
    }
    const updated = await Qualification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a qualification
 * @route  DELETE /api/qualifications/:id
 */
const deleteQualification = async (req, res, next) => {
  try {
    const qualification = await Qualification.findById(req.params.id);
    if (!qualification) {
      return res.status(404).json({ success: false, message: 'Qualification not found' });
    }
    await qualification.deleteOne();
    res.json({ success: true, message: 'Qualification removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete ALL qualifications (admin only, test environments)
 * @route  DELETE /api/qualifications
 * @access Private/Admin
 */
const deleteAllQualifications = async (req, res) => {
  const result = await Qualification.deleteMany({});
  res.json({ success: true, message: `${result.deletedCount} qualifications removed` });
};

module.exports = {
  getQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
  deleteAllQualifications,
};
