const { User, Student, Faculty } = require('../models');
const { generateToken } = require('../utils/token');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'STUDENT',
      phone,
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      'Registration successful',
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account is deactivated. Contact admin.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await Student.findOne({ user: user._id }).populate('department course');
    } else if (user.role === 'FACULTY') {
      profile = await Faculty.findOne({ user: user._id }).populate('department subjects');
    }

    const token = generateToken(user._id);

    return successResponse(res, 'Logged in successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'STUDENT') {
      profile = await Student.findOne({ user: user._id }).populate('department course');
    } else if (user.role === 'FACULTY') {
      profile = await Faculty.findOne({ user: user._id }).populate('department subjects');
    }

    return successResponse(res, 'Current user retrieved', {
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, address, guardianName, guardianPhone, cabinNumber } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return errorResponse(res, 'User not found', 404);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    if (user.role === 'STUDENT') {
      const student = await Student.findOne({ user: user._id });
      if (student) {
        if (address !== undefined) student.address = address;
        if (guardianName !== undefined) student.guardianName = guardianName;
        if (guardianPhone !== undefined) student.guardianPhone = guardianPhone;
        await student.save();
      }
    } else if (user.role === 'FACULTY') {
      const faculty = await Faculty.findOne({ user: user._id });
      if (faculty) {
        if (cabinNumber !== undefined) faculty.cabinNumber = cabinNumber;
        await faculty.save();
      }
    }

    return successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Please provide current and new password', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Incorrect current password', 400);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password (demo UI support)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'No user found with that email address', 404);
    }

    return successResponse(
      res,
      'Password reset instructions sent to your email (in demo, please contact administrator)'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
};
