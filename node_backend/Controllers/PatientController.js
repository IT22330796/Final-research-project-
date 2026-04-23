const Patient = require('../Models/Patient');

const createPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      condition,
      status,
      lastVisit,
      nextAppointment,
      insuranceProvider,
      insurancePolicyNumber,
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      condition,
      status,
      lastVisit,
      nextAppointment,
      insuranceProvider,
      insurancePolicyNumber,
      createdBy: req.user?.id,
    });

    return res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    return res.status(500).json({ message: 'Error creating patient' });
  }
};

const getPatients = async (req, res) => {
  try {
    const { status, condition, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (condition) {
      query.condition = condition;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({ message: 'Error fetching patients' });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return res.status(500).json({ message: 'Error fetching patient' });
  }
};

const updatePatient = async (req, res) => {
  try {
    const updates = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return res.status(500).json({ message: 'Error updating patient' });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return res.status(500).json({ message: 'Error deleting patient' });
  }
};

//get patients by createdUser id
const getPatientsByCreatedUserId = async (req, res) => {
  try {
    const patients = await Patient.find({ createdBy: req.user.id });
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients by created user id:', error);
    return res.status(500).json({ message: 'Error fetching patients by created user id' });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientsByCreatedUserId,
};

