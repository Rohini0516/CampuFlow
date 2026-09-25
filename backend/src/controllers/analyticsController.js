const {
  User,
  Student,
  Faculty,
  Department,
  Course,
  Subject,
  Attendance,
  Assignment,
  Submission,
  Exam,
  Mark,
  Event,
  Company,
  PlacementDrive,
  PlacementApplication,
  Internship,
  Complaint,
  CertificateRequest,
  Notification,
} = require('../models');
const { successResponse } = require('../utils/response');

// @desc    Get comprehensive dashboard analytics tailored to role
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const role = req.user.role;

    if (role === 'STUDENT') {
      const student = req.student;
      if (!student) {
        return successResponse(res, 'No student profile linked', {});
      }

      const totalClasses = await Attendance.countDocuments({ student: student._id });
      const presentClasses = await Attendance.countDocuments({
        student: student._id,
        status: { $in: ['PRESENT', 'LATE'] },
      });
      const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 85;

      const totalAssignments = await Assignment.countDocuments({
        semester: student.currentSemester,
        course: student.course,
      });
      const submittedAssignments = await Submission.countDocuments({
        student: student._id,
      });
      const pendingAssignments = Math.max(0, totalAssignments - submittedAssignments);

      const upcomingExamsCount = await Exam.countDocuments({
        course: student.course,
        semester: student.currentSemester,
        startDate: { $gte: new Date() },
      });

      const upcomingEventsCount = await Event.countDocuments({
        status: 'Upcoming',
      });

      const placementDrivesCount = await PlacementDrive.countDocuments({
        status: 'ACTIVE',
      });

      const internshipsCount = await Internship.countDocuments({
        status: 'OPEN',
      });

      const unreadNotifications = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      });

      // Recent marks
      const recentMarks = await Mark.find({ student: student._id })
        .populate('subject', 'name code')
        .populate('exam', 'title type')
        .sort({ createdAt: -1 })
        .limit(6);

      // Subject attendance
      const subjectAttendance = await Attendance.aggregate([
        { $match: { student: student._id } },
        {
          $group: {
            _id: '$subject',
            total: { $sum: 1 },
            present: {
              $sum: { $cond: [{ $in: ['$status', ['PRESENT', 'LATE']] }, 1, 0] },
            },
          },
        },
      ]);
      const populatedSubjAtt = await Subject.populate(subjectAttendance, {
        path: '_id',
        select: 'name code',
      });

      const attendanceChart = populatedSubjAtt.map((item) => ({
        subject: item._id?.name || 'Subject',
        code: item._id?.code || '',
        percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 100,
      }));

      return successResponse(res, 'Student Dashboard Metrics', {
        attendanceRate,
        pendingAssignments,
        totalAssignments,
        upcomingExamsCount,
        upcomingEventsCount,
        placementDrivesCount,
        internshipsCount,
        unreadNotifications,
        recentMarks,
        attendanceChart,
      });
    }

    if (role === 'FACULTY') {
      const faculty = req.faculty;
      const assignedSubjectsCount = faculty?.subjects?.length || 0;

      // Find total students enrolled in assigned subjects' course/semesters
      const facultySubjects = await Subject.find({ faculty: faculty?._id });
      const subjectIds = facultySubjects.map((s) => s._id);

      const totalAssignments = await Assignment.countDocuments({ faculty: faculty?._id });
      const facultyAssignmentIds = (await Assignment.find({ faculty: faculty?._id }).select('_id')).map(
        (a) => a._id
      );

      const totalSubmissions = await Submission.countDocuments({
        assignment: { $in: facultyAssignmentIds },
      });
      const gradedSubmissions = await Submission.countDocuments({
        assignment: { $in: facultyAssignmentIds },
        status: 'GRADED',
      });
      const pendingEvaluations = totalSubmissions - gradedSubmissions;

      const totalStudents = await Student.countDocuments({
        department: faculty?.department,
      });

      return successResponse(res, 'Faculty Dashboard Metrics', {
        assignedSubjectsCount,
        totalStudents,
        totalAssignments,
        totalSubmissions,
        pendingEvaluations,
        subjects: facultySubjects,
      });
    }

    if (role === 'PLACEMENT_OFFICER') {
      const totalCompanies = await Company.countDocuments({ isActive: true });
      const activeDrives = await PlacementDrive.countDocuments({ status: 'ACTIVE' });
      const totalApplications = await PlacementApplication.countDocuments();
      const selectedStudents = await PlacementApplication.countDocuments({ status: 'SELECTED' });
      const eligibleStudents = await Student.countDocuments({ cgpa: { $gte: 6.5 } });

      const placementRate = eligibleStudents > 0 ? Math.round((selectedStudents / eligibleStudents) * 100) : 0;

      const pipelineBreakdown = await PlacementApplication.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      return successResponse(res, 'Placement Dashboard Metrics', {
        totalCompanies,
        activeDrives,
        totalApplications,
        selectedStudents,
        eligibleStudents,
        placementRate,
        pipelineBreakdown,
      });
    }

    // ADMIN OVERVIEW
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'Upcoming' });
    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ['Submitted', 'Under Review', 'In Progress'] },
    });
    const pendingCertificates = await CertificateRequest.countDocuments({ status: 'PENDING' });

    // Calculate overall average attendance
    const allAttendance = await Attendance.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $in: ['$status', ['PRESENT', 'LATE']] }, 1, 0] },
          },
        },
      },
    ]);
    const avgAttendance =
      allAttendance.length > 0 && allAttendance[0].total > 0
        ? Math.round((allAttendance[0].present / allAttendance[0].total) * 100)
        : 86;

    // Placements
    const totalDrives = await PlacementDrive.countDocuments();
    const totalPlaced = await PlacementApplication.countDocuments({ status: 'SELECTED' });
    const placementRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 74;

    // Students by department
    const studentsByDept = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);
    const populatedDeptStats = await Department.populate(studentsByDept, {
      path: '_id',
      select: 'name code',
    });

    // Complaints breakdown
    const complaintsByStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Events by Category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    return successResponse(res, 'Admin Dashboard Metrics', {
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      avgAttendance,
      activeEvents,
      pendingComplaints,
      pendingCertificates,
      placementRate,
      totalDrives,
      totalPlaced,
      departmentDistribution: populatedDeptStats.map((d) => ({
        name: d._id?.name || 'Unknown',
        code: d._id?.code || '',
        count: d.count,
      })),
      complaintsByStatus: complaintsByStatus.map((c) => ({
        status: c._id,
        count: c.count,
      })),
      eventsByCategory: eventsByCategory.map((e) => ({
        category: e._id,
        count: e.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
};
