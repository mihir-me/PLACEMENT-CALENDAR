const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyVisitDate: {
      type: Date,
      required: [true, 'Company visit date is required'],
    },
    status: {
      type: String,
      enum: ['OA', 'INTERVIEW_1', 'INTERVIEW_2', 'HR', 'PLACED', 'REJECTED'],
      required: [true, 'Status is required'],
    },
    place: {
      type: String,
      enum: ['RVITM', 'RVECE', 'HOME'],
      required: [true, 'Place is required'],
    },
    offerType: {
      type: String,
      enum: ['INTERN', 'INTERN_PBC', 'INTERN_FTE', 'FTE'],
      required: [true, 'Offer type is required'],
    },
    progress: {
      type: String,
      enum: ['OA_CLEARED', 'OA_REJECTED', 'TI1', 'TI2', 'HR1', 'HR2', 'NOT_ELIGIBLE', 'PLACED'],
      default: 'OA_CLEARED',
    },
  },
  { timestamps: true }
);

eventSchema.index({ userId: 1, companyVisitDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
