const mongoose = require('mongoose');

/**
 * Qualification schema — title, completion date, description.
 */
const qualificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Qualification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    completionDate: {
      type: Date,
      required: [true, 'Completion date is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Qualification', qualificationSchema);
