const jwt = require('jsonwebtoken');
const { User, Student, Faculty } = require('../models');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'campusflow_super_secret_jwt_key_2026_production'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User no longer exists', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account has been deactivated', 403);
    }

    req.user = user;

    // Attach student or faculty profile if available
    if (user.role === 'STUDENT') {
      req.student = await Student.findOne({ user: user._id });
    } else if (user.role === 'FACULTY') {
      req.faculty = await Faculty.findOne({ user: user._id });
    }

    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user?.role || 'Guest'}' is not authorized to access this route`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
