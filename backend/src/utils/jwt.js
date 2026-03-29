const jwt = require('jsonwebtoken');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const createAuthResponse = (user) => ({
  token: signToken(user._id),
  user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
});

module.exports = { signToken, createAuthResponse };