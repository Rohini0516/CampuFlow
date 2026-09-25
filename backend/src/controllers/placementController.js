const {
  Company,
  PlacementDrive,
  PlacementApplication,
  Student,
  Notification,
} = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// --- COMPANIES ---
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isActive: true }).sort({ name: 1 });
    return successResponse(res, 'Companies retrieved', companies);
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    return successResponse(res, 'Company added successfully', company, 201);
  } catch (error) {
    next(error);
  }
};

// --- PLACEMENT DRIVES ---
const getPlacementDrives = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;

    let drives = await PlacementDrive.find(query)
      .populate('company', 'name logo website industry')
      .populate('eligibilityCriteria.allowedDepartments', 'name code')
      .sort({ driveDate: 1 });

    if (search) {
      drives = drives.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.role.toLowerCase().includes(search.toLowerCase()) ||
          d.company?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // If student, calculate eligibility and application status
    if (req.user.role === 'STUDENT' && req.student) {
      const student = req.student;
      const applications = await PlacementApplication.find({
        student: student._id,
      });
      const appMap = new Map();
      applications.forEach((a) => appMap.set(a.placementDrive.toString(), a));

      const enriched = drives.map((drive) => {
        const myApp = appMap.get(drive._id.toString());
        // Eligibility check
        const meetsCgpa = (student.cgpa || 0) >= (drive.eligibilityCriteria?.minCgpa || 0);
        const allowedDepts = drive.eligibilityCriteria?.allowedDepartments || [];
        const meetsDept =
          allowedDepts.length === 0 ||
          allowedDepts.some((d) => d._id.toString() === student.department?.toString());
        const isEligible = meetsCgpa && meetsDept;

        return {
          ...drive.toObject(),
          isEligible,
          isApplied: !!myApp,
          myApplication: myApp || null,
        };
      });

      return successResponse(res, 'Placement drives retrieved', enriched);
    }

    return successResponse(res, 'Placement drives retrieved', drives);
  } catch (error) {
    next(error);
  }
};

const getPlacementDriveById = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      .populate('company')
      .populate('eligibilityCriteria.allowedDepartments', 'name code');

    if (!drive) return errorResponse(res, 'Placement drive not found', 404);

    let myApplication = null;
    if (req.user.role === 'STUDENT' && req.student) {
      myApplication = await PlacementApplication.findOne({
        placementDrive: drive._id,
        student: req.student._id,
      });
    }

    let applications = [];
    if (req.user.role === 'ADMIN' || req.user.role === 'PLACEMENT_OFFICER') {
      applications = await PlacementApplication.find({ placementDrive: drive._id })
        .populate({
          path: 'student',
          populate: [
            { path: 'user', select: 'name email phone avatar' },
            { path: 'department', select: 'name code' },
            { path: 'course', select: 'name code' },
          ],
        })
        .sort({ appliedDate: -1 });
    }

    return successResponse(res, 'Drive details retrieved', {
      drive,
      myApplication,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

const createPlacementDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await PlacementDrive.findById(drive._id)
      .populate('company', 'name logo')
      .populate('eligibilityCriteria.allowedDepartments', 'name code');

    return successResponse(res, 'Placement drive created successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

const updatePlacementDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('company', 'name logo')
      .populate('eligibilityCriteria.allowedDepartments', 'name code');

    if (!drive) return errorResponse(res, 'Placement drive not found', 404);
    return successResponse(res, 'Placement drive updated successfully', drive);
  } catch (error) {
    next(error);
  }
};

// --- APPLICATIONS & PIPELINE ---
const applyForPlacementDrive = async (req, res, next) => {
  try {
    if (!req.student) return errorResponse(res, 'Student profile required', 403);

    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) return errorResponse(res, 'Placement drive not found', 404);

    if (new Date() > new Date(drive.deadline)) {
      return errorResponse(res, 'Application deadline has passed', 400);
    }

    const existing = await PlacementApplication.findOne({
      placementDrive: drive._id,
      student: req.student._id,
    });
    if (existing) {
      return errorResponse(res, 'You have already applied for this drive', 400);
    }

    const { resumeUrl, notes } = req.body;

    const application = await PlacementApplication.create({
      placementDrive: drive._id,
      student: req.student._id,
      resumeUrl: resumeUrl || '',
      notes: notes || '',
      status: 'APPLIED',
      roundFeedback: [
        {
          roundName: 'Applied',
          status: 'Submitted',
          feedback: 'Application received and under review by Placement Cell',
        },
      ],
    });

    return successResponse(res, 'Application submitted successfully', application, 201);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, roundName, feedback, offeredPackage } = req.body;

    const application = await PlacementApplication.findById(req.params.id)
      .populate('student')
      .populate('placementDrive');

    if (!application) return errorResponse(res, 'Application not found', 404);

    application.status = status;
    if (roundName && feedback) {
      application.roundFeedback.push({
        roundName,
        status,
        feedback,
      });
    }

    if (status === 'SELECTED' && offeredPackage) {
      application.offerDetails = {
        offeredPackage: Number(offeredPackage),
        joiningDate: new Date(),
      };
    }

    await application.save();

    // Send notification to student
    if (application.student) {
      const studentObj = await Student.findById(application.student._id);
      if (studentObj && studentObj.user) {
        await Notification.create({
          recipient: studentObj.user,
          title: `Placement Status Update: ${application.placementDrive?.title}`,
          message: `Your application status has been updated to: ${status}`,
          type: 'PLACEMENT',
          link: `/placements/${application.placementDrive?._id}`,
        });
      }
    }

    return successResponse(res, 'Application status updated successfully', application);
  } catch (error) {
    next(error);
  }
};

const getPlacementApplications = async (req, res, next) => {
  try {
    const { driveId, status } = req.query;
    const query = {};
    if (driveId) query.placementDrive = driveId;
    if (status) query.status = status;

    if (req.user.role === 'STUDENT' && req.student) {
      query.student = req.student._id;
    }

    const applications = await PlacementApplication.find(query)
      .populate({
        path: 'placementDrive',
        populate: { path: 'company', select: 'name logo industry' },
      })
      .populate({
        path: 'student',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name code' },
          { path: 'course', select: 'name code' },
        ],
      })
      .sort({ appliedDate: -1 });

    return successResponse(res, 'Applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  createCompany,
  getPlacementDrives,
  getPlacementDriveById,
  createPlacementDrive,
  updatePlacementDrive,
  applyForPlacementDrive,
  updateApplicationStatus,
  getPlacementApplications,
};
