const { User, Faculty, Department, Subject } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private
const getAllFaculty = async (req, res, next) => {
  try {
    const { department, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (department) query.department = department;

    let userMatch = {};
    if (search) {
      userMatch = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let facultyList = await Faculty.find(query)
      .populate({
        path: 'user',
        match: search ? userMatch : {},
        select: 'name email phone avatar isActive',
      })
      .populate('department', 'name code')
      .populate('subjects', 'name code semester')
      .sort({ createdAt: -1 });

    if (search) {
      facultyList = facultyList.filter(
        (f) => f.user !== null || f.employeeId.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = facultyList.length;
    const paginated = facultyList.slice(skip, skip + Number(limit));

    return successResponse(res, 'Faculty list retrieved', {
      faculty: paginated,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty by ID
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code hodName')
      .populate('subjects', 'name code semester credits');

    if (!faculty) {
      return errorResponse(res, 'Faculty member not found', 404);
    }

    return successResponse(res, 'Faculty retrieved', faculty);
  } catch (error) {
    next(error);
  }
};

// @desc    Create faculty member (Admin)
// @route   POST /api/faculty
// @access  Private (Admin)
const createFaculty = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      employeeId,
      department,
      designation,
      qualification,
      experienceYears,
      subjects,
      cabinNumber,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    const existingEmpId = await Faculty.findOne({ employeeId });
    if (existingEmpId) {
      return errorResponse(res, 'Faculty already exists with this Employee ID', 400);
    }

    const user = await User.create({
      name,
      email,
      password: password || 'CampusFaculty@123',
      role: 'FACULTY',
      phone,
    });

    const faculty = await Faculty.create({
      user: user._id,
      employeeId,
      department,
      designation: designation || 'Assistant Professor',
      qualification: qualification || 'M.Tech / Ph.D',
      experienceYears: experienceYears || 3,
      subjects: subjects || [],
      cabinNumber: cabinNumber || '',
    });

    const populated = await Faculty.findById(faculty._id)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('subjects', 'name code');

    return successResponse(res, 'Faculty created successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private (Admin / Faculty self)
const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return errorResponse(res, 'Faculty not found', 404);
    }

    const {
      name,
      phone,
      isActive,
      department,
      designation,
      qualification,
      experienceYears,
      subjects,
      cabinNumber,
    } = req.body;

    if (name || phone !== undefined || isActive !== undefined) {
      const user = await User.findById(faculty.user);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (isActive !== undefined) user.isActive = isActive;
        await user.save();
      }
    }

    if (department) faculty.department = department;
    if (designation) faculty.designation = designation;
    if (qualification) faculty.qualification = qualification;
    if (experienceYears !== undefined) faculty.experienceYears = experienceYears;
    if (subjects) faculty.subjects = subjects;
    if (cabinNumber !== undefined) faculty.cabinNumber = cabinNumber;
    if (isActive !== undefined) faculty.isActive = isActive;

    await faculty.save();

    const updated = await Faculty.findById(faculty._id)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('subjects', 'name code semester');

    return successResponse(res, 'Faculty updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign subjects to faculty
// @route   PUT /api/faculty/:id/assign-subjects
// @access  Private (Admin)
const assignSubjects = async (req, res, next) => {
  try {
    const { subjects } = req.body;
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return errorResponse(res, 'Faculty not found', 404);

    faculty.subjects = subjects;
    await faculty.save();

    // Also update faculty ref in subject model
    await Subject.updateMany({ _id: { $in: subjects } }, { faculty: faculty._id });

    const updated = await Faculty.findById(faculty._id)
      .populate('user', 'name email')
      .populate('subjects', 'name code semester');

    return successResponse(res, 'Subjects assigned successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private (Admin)
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return errorResponse(res, 'Faculty not found', 404);

    await User.findByIdAndDelete(faculty.user);
    await Faculty.findByIdAndDelete(faculty._id);

    return successResponse(res, 'Faculty deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  assignSubjects,
  deleteFaculty,
};
