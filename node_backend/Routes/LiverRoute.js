const express = require('express');
const router = express.Router();
const { predictLiverRisk } = require('../Controllers/LiverController');
const { auth } = require('../Middleware/auth');

// Endpoint for liver disease risk prediction using clinical data
router.post('/predict-risk', auth, predictLiverRisk);

// Test route to verify if the router is working
router.get('/status', (req, res) => res.json({ status: 'Liver router is active' }));

module.exports = router;
