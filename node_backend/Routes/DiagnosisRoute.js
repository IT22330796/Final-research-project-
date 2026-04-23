const express = require('express');
const router = express.Router();
const {upload} = require('../Middleware/upload');

const {
  createDiagnosis,
  getDiagnoses,
  getDiagnosisById,
  updateDiagnosis,
  deleteDiagnosis,
} = require('../Controllers/DiagnosisController');

const { auth } = require('../Middleware/auth');

// Create diagnosis (with image upload)
router.post('/diagnoses', auth, upload.single('image'), createDiagnosis);

// Other routes
router.get('/diagnoses', auth, getDiagnoses);
router.get('/diagnoses/:id', auth, getDiagnosisById);
router.put('/diagnoses/:id', auth, updateDiagnosis);
router.delete('/diagnoses/:id', auth, deleteDiagnosis);

module.exports = router;