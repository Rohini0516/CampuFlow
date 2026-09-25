const { User, Student, Department, Course } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all students with search & filter
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res, next) => {
  try {
    const {
      search,
      department,
      course,
      semester,
      year,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (department) query.department = department;
    if (course) query.course = course;
    if (semester) query.currentSemester = Number(semester);
    if (year) query.currentYear = Number(year);

    let userMatch = {};
    if (search) {
      userMatch = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let students = await Student.find(query)
      .populate({
        path: 'user',
        match: search ? userMatch : {},
        select: 'name email phone avatar isActive',
      })
      .populate('department', 'name code')
      .populate('course', 'name code')
      .sort({ createdAt: -1 });

    // Filter out populated null users if search was applied
    if (search) {
      students = students.filter(
        (s) => s.user !== null || s.rollNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = students.length;
    const paginatedStudents = students.slice(skip, skip + Number(limit));

    return successResponse(res, 'Students retrieved successfully', {
      students: paginatedStudents,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code hodName')
      .populate('course', 'name code durationYears totalSemesters');

    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    return successResponse(res, 'Student retrieved successfully', student);
  } catch (error) {
    next(error);
  }
};

// @desc    Create student (Admin)
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      rollNumber,
      department,
      course,
      currentYear,
      currentSemester,
      academicYear,
      dob,
      gender,
      address,
      guardianName,
      guardianPhone,
      cgpa,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'A user with this email already exists', 400);
    }

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return errorResponse(res, 'A student with this roll number already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password: password || 'CampusFlow@123',
      role: 'STUDENT',
      phone,
    });

    const student = await Student.create({
      user: user._id,
      rollNumber,
      department,
      course,
      currentYear: currentYear || 1,
      currentSemester: currentSemester || 1,
      academicYear: academicYear || '2025-2026',
      dob,
      gender: gender || 'Male',
      address,
      guardianName,
      guardianPhone,
      cgpa: cgpa || 8.0,
    });

    const populatedStudent = await Student.findById(student._id)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('course', 'name code');

    return successResponse(res, 'Student created successfully', populatedStudent, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    const {
      name,
      phone,
      isActive,
      department,
      course,
      currentYear,
      currentSemester,
      academicYear,
      dob,
      gender,
      address,
      guardianName,
      guardianPhone,
      cgpa,
      attendancePercentage,
    } = req.body;

    // Update user record
    if (name || phone !== undefined || isActive !== undefined) {
      const user = await User.findById(student.user);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (isActive !== undefined) user.isActive = isActive;
        await user.save();
      }
    }

    // Update student record
    if (department) student.department = department;
    if (course) student.course = course;
    if (currentYear !== undefined) student.currentYear = currentYear;
    if (currentSemester !== undefined) student.currentSemester = currentSemester;
    if (academicYear) student.academicYear = academicYear;
    if (dob) student.dob = dob;
    if (gender) student.gender = gender;
    if (address !== undefined) student.address = address;
    if (guardianName !== undefined) student.guardianName = guardianName;
    if (guardianPhone !== undefined) student.guardianPhone = guardianPhone;
    if (cgpa !== undefined) student.cgpa = cgpa;
    if (attendancePercentage !== undefined) student.attendancePercentage = attendancePercentage;
    if (isActive !== undefined) student.isActive = isActive;

    await student.save();

    const updated = await Student.findById(student._id)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('course', 'name code');

    return successResponse(res, 'Student updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(student._id);

    return successResponse(res, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
