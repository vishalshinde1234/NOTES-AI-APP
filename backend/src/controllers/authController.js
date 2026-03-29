const User = require('../models/User');
const { createAuthResponse } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, ...createAuthResponse(user) });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    res.json({ success: true, ...createAuthResponse(user) });
  } catch (err) { next(err); }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };