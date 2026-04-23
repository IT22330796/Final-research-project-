require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const userRoutes = require('./Routes/UserRoute');
const authRoutes = require('./Routes/AuthRoute');
const patientRoutes = require('./Routes/PatientRoute');
const diagnosisRoutes = require('./Routes/DiagnosisRoute');
const liverRoutes = require('./Routes/LiverRoute');

const app = express();

app.use(helmet());
app.use(cors());
app.use(
  express.json({
    limit: '10mb',
  })
);
app.use(
  express.urlencoded({
    limit: '10mb',
    extended: true,
  })
);

// health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/liver', liverRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', patientRoutes);
app.use('/api', diagnosisRoutes);

// Global error handler (fallback)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // Wait 10s for server selection
    connectTimeoutMS: 10000, // Wait 10s for initial connection
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Mongoose initial connection error:', err);
  });

// Handle connection events after initial connect
mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});
