const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Allowed origins for CORS (Localhost + Vercel deployment + environment config)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://campu-flow.vercel.app',
  'https://campuflow.onrender.com',
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.trim());
  allowedOrigins.push(process.env.CLIENT_URL.trim().replace(/\/$/, ''));
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes(origin.replace(/\/$/, '')) ||
      /\.vercel\.app$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'CampusFlow Backend API is running',
    healthCheck: '/api/health',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  return res.status(200).json({
    success: true,
    message: 'CampusFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));
app.use('/api/communication', require('./routes/communicationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 handler for undefined API routes
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CampusFlow Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
