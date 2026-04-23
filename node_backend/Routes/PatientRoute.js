const express = require('express');
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientsByCreatedUserId,
} = require('../Controllers/PatientController');

const { auth, requireRole } = require('../Middleware/auth');

// All patient routes require authentication
router.post('/patients', auth, createPatient);
router.get('/patients', auth, getPatients);
router.get('/patients/:id', auth, getPatientById);
router.put('/patients/:id', auth, updatePatient);
router.delete('/patients/:id', auth, requireRole('admin'), deletePatient);
router.get('/patients/created-user-id/:userId', auth, getPatientsByCreatedUserId);

module.exports = router;

