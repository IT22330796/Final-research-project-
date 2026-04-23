const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const diagnosisSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: false,
    },
    disease: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    eye: {
      type: String,
      enum: ['LEFT', 'RIGHT', 'BOTH'],
      default: 'LEFT',
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['Checked', 'Unchecked'],
      default: 'Checked',
    },
    prescribedMedicine: {
      type: String,
      trim: true,
    },
    recommendedTests: [
      {
        type: String,
        trim: true,
      },
    ],
    clinicalNotes: {
      type: String,
      trim: true,
    },
    referralValidationReport: {
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

module.exports = mongoose.model('Diagnosis', diagnosisSchema);

