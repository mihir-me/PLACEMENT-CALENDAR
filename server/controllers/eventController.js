const Event = require('../models/Event');

const VALID_STATUSES = ['OA', 'INTERVIEW_1', 'INTERVIEW_2', 'HR', 'PLACED', 'REJECTED'];
const VALID_PLACES = ['RVITM', 'RVCE', 'HOME'];
const VALID_OFFER_TYPES = ['INTERN', 'INTERN_PBC', 'INTERN_FTE', 'FTE'];
const VALID_PROGRESS = ['OA_CLEARED', 'OA_REJECTED', 'TI1', 'TI2', 'HR1', 'HR2', 'NOT_ELIGIBLE', 'PLACED'];

exports.getEvents = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.companyVisitDate = { $gte: startDate, $lte: endDate };
    }

    const events = await Event.find(query).sort({ companyVisitDate: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { companyName, companyVisitDate, status, place, offerType, progress } = req.body;

    if (!companyName || !companyVisitDate || !status || !place || !offerType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}` });
    }
    if (!VALID_PLACES.includes(place)) {
      return res.status(400).json({ success: false, message: `Invalid place. Allowed: ${VALID_PLACES.join(', ')}` });
    }
    if (!VALID_OFFER_TYPES.includes(offerType)) {
      return res.status(400).json({ success: false, message: `Invalid offer type. Allowed: ${VALID_OFFER_TYPES.join(', ')}` });
    }
    if (progress && !VALID_PROGRESS.includes(progress)) {
      return res.status(400).json({ success: false, message: `Invalid progress. Allowed: ${VALID_PROGRESS.join(', ')}` });
    }

    const visitDate = new Date(companyVisitDate);
    if (isNaN(visitDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    const event = await Event.create({
      userId: req.userId,
      companyName: companyName.trim(),
      companyVisitDate: visitDate,
      status,
      place,
      offerType,
      progress: progress || 'OA_CLEARED',
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { companyName, companyVisitDate, status, place, offerType, progress } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}` });
    }
    if (place && !VALID_PLACES.includes(place)) {
      return res.status(400).json({ success: false, message: `Invalid place. Allowed: ${VALID_PLACES.join(', ')}` });
    }
    if (offerType && !VALID_OFFER_TYPES.includes(offerType)) {
      return res.status(400).json({ success: false, message: `Invalid offer type. Allowed: ${VALID_OFFER_TYPES.join(', ')}` });
    }
    if (progress && !VALID_PROGRESS.includes(progress)) {
      return res.status(400).json({ success: false, message: `Invalid progress. Allowed: ${VALID_PROGRESS.join(', ')}` });
    }

    const updateData = {};
    if (companyName) updateData.companyName = companyName.trim();
    if (companyVisitDate) {
      const visitDate = new Date(companyVisitDate);
      if (isNaN(visitDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date' });
      }
      updateData.companyVisitDate = visitDate;
    }
    if (status) updateData.status = status;
    if (place) updateData.place = place;
    if (offerType) updateData.offerType = offerType;
    if (progress) updateData.progress = progress;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
