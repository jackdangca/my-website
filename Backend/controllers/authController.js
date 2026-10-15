const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * Generate a signed JWT access token for a user.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @desc   Sign up / register a new user
 * @route  POST /api/auth/register
 */
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: user.toSafeUser(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Sign in / login
 * @route  POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  try {
    const { email, password } = req.body;

    // select('+password') re-enables the field that is excluded by default.
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      data: user.toSafeUser(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Sign out / logout
 * @route  POST /api/auth/logout
 * @access Public
 */
const logoutUser = (req, res) => {
  res.json({
    success: true,
    message:
      'Logged out.' });
};

/**
 * @desc   Get the currently authenticated user's profile
 * @route  GET /api/auth/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user.toSafeUser() });
};

/**
 * Seed a default admin user from environment variables if none exists.
 * Called once at server startup.
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin123!',
        role: 'admin',
      });
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error(`⚠️  Could not seed admin: ${error.message}`);
  }
};

module.exports = { registerUser, loginUser, logoutUser, getProfile, seedAdmin };
