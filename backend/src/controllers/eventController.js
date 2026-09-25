const { Event, EventRegistration, Student } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query).sort({ date: 1 });

    // If student, check if registered
    if (req.user.role === 'STUDENT' && req.student) {
      const registrations = await EventRegistration.find({
        student: req.student._id,
      });
      const regMap = new Map();
      registrations.forEach((r) => regMap.set(r.event.toString(), r));

      const enriched = events.map((evt) => {
        const reg = regMap.get(evt._id.toString());
        return {
          ...evt.toObject(),
          isRegistered: !!reg,
          myRegistration: reg || null,
        };
      });

      return successResponse(res, 'Events retrieved', enriched);
    }

    // Attach participant counts for admin/faculty
    const eventIds = events.map((e) => e._id);
    const counts = await EventRegistration.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);
    const countMap = new Map();
    counts.forEach((c) => countMap.set(c._id.toString(), c.count));

    const enriched = events.map((evt) => ({
      ...evt.toObject(),
      registeredCount: countMap.get(evt._id.toString()) || 0,
    }));

    return successResponse(res, 'Events retrieved', enriched);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID & its participants
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);

    let myRegistration = null;
    if (req.user.role === 'STUDENT' && req.student) {
      myRegistration = await EventRegistration.findOne({
        event: event._id,
        student: req.student._id,
      });
    }

    const participants = await EventRegistration.find({ event: event._id })
      .populate({
        path: 'student',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name code' },
          { path: 'course', select: 'name code' },
        ],
      })
      .sort({ registrationDate: -1 });

    return successResponse(res, 'Event details retrieved', {
      event,
      myRegistration,
      participants,
      totalParticipants: participants.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin, Faculty)
const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return successResponse(res, 'Event created successfully', event, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin, Faculty)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, 'Event updated successfully', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);
    await EventRegistration.deleteMany({ event: event._id });
    return successResponse(res, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event (Student)
// @route   POST /api/events/:id/register
// @access  Private (Student)
const registerForEvent = async (req, res, next) => {
  try {
    if (!req.student) return errorResponse(res, 'Student profile required', 403);

    const event = await Event.findById(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);

    const count = await EventRegistration.countDocuments({ event: event._id });
    if (count >= event.capacity) {
      return errorResponse(res, 'Event capacity is full', 400);
    }

    const existing = await EventRegistration.findOne({
      event: event._id,
      student: req.student._id,
    });
    if (existing) {
      return errorResponse(res, 'You are already registered for this event', 400);
    }

    const reg = await EventRegistration.create({
      event: event._id,
      student: req.student._id,
    });

    return successResponse(res, 'Successfully registered for event', reg, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
