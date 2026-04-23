const Diagnosis = require('../Models/Diagnosis');
const supabase = require('../Config/superbaseConfig');
const { v4: uuidv4 } = require('uuid');

const createDiagnosis = async (req, res) => {
  try {
    let {
      patient,
      disease,
      diagnosis,
      eye,
      confidence,
      status,
      prescribedMedicine,
      recommendedTests,
      clinicalNotes,
      referralValidationReport,
    } = req.body;

    if (!disease || !diagnosis) {
      return res.status(400).json({ message: 'Disease and diagnosis are required' });
    }

    // Parse recommendedTests if sent as JSON string from multipart/form-data
    if (typeof recommendedTests === 'string') {
      try {
        recommendedTests = JSON.parse(recommendedTests);
      } catch (e) {
        // Fallback: single string value
        recommendedTests = recommendedTests ? [recommendedTests] : [];
      }
    }

    // Ensure recommendedTests is an array
    if (!Array.isArray(recommendedTests)) {
      recommendedTests = [];
    }

    // Normalize confidence to number (0–100)
    const numericConfidence =
      confidence !== undefined && confidence !== null && confidence !== ''
        ? Number(confidence)
        : undefined;

    let imageUrl = null;

    // If image file exists, upload to Supabase
    if (req.file) {
      if (!supabase) {
        return res
          .status(500)
          .json({ message: 'Image upload is not configured on the server' });
      }

      const file = req.file;
      const fileName = `${uuidv4()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET || 'Eye_images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return res.status(500).json({ message: 'Image upload failed' });
      }

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET || 'eye-images')
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const doc = await Diagnosis.create({
      patient,
      disease,
      diagnosis,
      eye,
      imageUrl,
      confidence: numericConfidence,
      status,
      prescribedMedicine,
      recommendedTests,
      clinicalNotes,
      referralValidationReport,
      createdBy: req.user?.id,
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error('Error creating diagnosis:', error);
    return res.status(500).json({ message: 'Error creating diagnosis' });
  }
};

const getDiagnoses = async (req, res) => {
  try {
    const { patient, disease, status } = req.query;
    const query = {};

    if (patient) {
      query.patient = patient;
    }

    if (disease) {
      query.disease = disease;
    }

    if (status) {
      query.status = status;
    }

    const diagnoses = await Diagnosis.find(query)
      .populate('patient')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(diagnoses);
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
    return res.status(500).json({ message: 'Error fetching diagnoses' });
  }
};

const getDiagnosisById = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id)
      .populate('patient')
      .populate('createdBy', 'name email role');

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    return res.status(500).json({ message: 'Error fetching diagnosis' });
  }
};

const updateDiagnosis = async (req, res) => {
  try {
    const updates = req.body;

    const diagnosis = await Diagnosis.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    console.error('Error updating diagnosis:', error);
    return res.status(500).json({ message: 'Error updating diagnosis' });
  }
};

const deleteDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findByIdAndDelete(req.params.id);
    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    return res.status(200).json({ message: 'Diagnosis deleted successfully' });
  } catch (error) {
    console.error('Error deleting diagnosis:', error);
    return res.status(500).json({ message: 'Error deleting diagnosis' });
  }
};

module.exports = {
  createDiagnosis,
  getDiagnoses,
  getDiagnosisById,
  updateDiagnosis,
  deleteDiagnosis,
};

