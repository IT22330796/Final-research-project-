const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    condition: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Monitoring', 'Scheduled', 'Critical'],
      default: 'Active',
    },
    lastVisit: {
      type: Date,
    },
    nextAppointment: {
      type: Date,
    },
    insuranceProvider: {
      type: String,
      trim: true,
    },
    insurancePolicyNumber: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);

