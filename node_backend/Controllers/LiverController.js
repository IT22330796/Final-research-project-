const axios = require('axios');

const predictLiverRisk = async (req, res) => {
  try {
    const clinicalData = req.body;

    // Flask API URL (Update if port or host is different)
    const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:8000';

    const response = await axios.post(`${FLASK_API_URL}/liver/predict-clinical`, clinicalData);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in liver risk prediction proxy:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ message: 'Flask server is unavailable' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = {
  predictLiverRisk,
};
