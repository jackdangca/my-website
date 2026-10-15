const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const findProject = (identifier) => {
  if (mongoose.isValidObjectId(identifier)) {
    return Project.findOne({ $or: [{ _id: identifier }, { id: identifier }] });
  }
  return Project.findOne({ id: identifier });
};

/**
 * @desc   Get all projects
 * @route  GET /api/projects
 */
const getProjects = async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: projects.length,
    data: projects,
  });
};

/**
 * @desc   Get a single project
 * @route  GET /api/projects/:id
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await findProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a project
 * @route  POST /api/projects
 */
const createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a project
 * @route  PUT /api/projects/:id
 */
const updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const project = await findProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    const updated = await Project.findOneAndUpdate({ _id: project._id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a project
 * @route  DELETE /api/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await findProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete ALL projects (admin only, test environments)
 * @route  DELETE /api/projects
 * @access Private/Admin
 */
const deleteAllProjects = async (req, res) => {
  const result = await Project.deleteMany({});
  res.json({ success: true, message: `${result.deletedCount} projects removed` });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
};
