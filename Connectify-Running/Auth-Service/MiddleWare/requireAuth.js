const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const requireAuth = async (req, res, next) => {
  try {

    const authHeader = req.header('Authorization');
    const token = authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer '))
      ? authHeader.split(' ')[1]
      : null;

    console.log('Token:', token);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = { id: user._id };
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = requireAuth;
