const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Keeping healthRoutes if it exists, or handling inline if not found. We'll just assume it exists.
// The user prompt said "Keep health route" and "Keep error middleware"
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads: internal only
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/admin', adminRoutes);

// Root route welcome message
app.get('/', (req, res) => {
  res.json({
    app: 'SCHOLARO - Eligible Scholarship Finder API',
    status: 'Active',
    healthCheck: '/api/health'
  });
});

// 404 & Global Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server (only if not required as a module, or just run it)
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`🚀 SCHOLARO Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`👉 Health Check Endpoint: http://localhost:${PORT}/api/health`);
    
    // Test Database Connection
    await testConnection();
  });
}

module.exports = app;
