const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * @desc   Get all users (password excluded)
 * @route  GET /api/users
 * @access Private
 */
const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
};

/**
 * @desc   Get a single user (password excluded)
 * @route  GET /api/users/:id
 * @access Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a user (name/email, password handled separately in auth)
 * @route  PUT /api/users/:id
 * @access Private
 */
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Users may only update their own profile unless they are an admin.
    if (req.user.id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden, you can only update your own profile',
      });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email;

    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a user
 * @route  DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete ALL users (admin only, test environments)
 * @route  DELETE /api/users
 * @access Private/Admin
 */
const deleteAllUsers = async (req, res) => {
  const result = await User.deleteMany({});
  res.json({ success: true, message: `${result.deletedCount} users removed` });
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
};
