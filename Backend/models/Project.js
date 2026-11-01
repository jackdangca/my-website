const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Project id is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Project id must be a lowercase slug'],
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    completionDate: {
      type: Date,
      required: [true, 'Project completion date is required'],
    },
    image: {
      type: String,
      required: [true, 'Project image is required'],
      trim: true,
    },
    alt: {
      type: String,
      required: [true, 'Project image alt text is required'],
      trim: true,
      maxlength: [300, 'Image alt text cannot exceed 300 characters'],
    },
    role: {
      type: String,
      required: [true, 'Project role is required'],
      trim: true,
      maxlength: [200, 'Role cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    techStack: {
      type: [
        {
          type: String,
          trim: true,
          required: true,
        },
      ],
      required: [true, 'Project tech stack is required'],
      validate: {
        validator: (techStack) =>
          techStack.length > 0 && techStack.every((technology) => technology.length > 0),
        message: 'Project tech stack must contain at least one technology',
      },
    },
    outcome: {
      type: String,
      required: [true, 'Project outcome is required'],
      trim: true,
      maxlength: [2000, 'Outcome cannot exceed 2000 characters'],
    },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.model('Project', projectSchema);
