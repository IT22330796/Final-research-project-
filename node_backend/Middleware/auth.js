const jwt = require('jsonwebtoken');
const User = require('../Models/UserSchema');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User no longer active' });
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    next();
  };
};

module.exports = {
  auth,
  requireRole,
};

