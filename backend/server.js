const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authController = require('./controllers/authController');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow the deployed Vercel frontend via FRONTEND_URL env var
// In production, set FRONTEND_URL=https://your-app.vercel.app
// In development, FRONTEND_URL=http://localhost:3000
const allowedOrigins = [];

if (process.env.FRONTEND_URL) {
  // Support comma-separated list of origins
  process.env.FRONTEND_URL.split(',').forEach(u => {
    const trimmed = u.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

// Always allow localhost origins in development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
  allowedOrigins.push('http://localhost:5173');
  allowedOrigins.push('http://127.0.0.1:3000');
  allowedOrigins.push('http://127.0.0.1:5173');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    // In non-production mode, allow any localhost / 127.0.0.1 origin regardless of port
    if (process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Automatically allow any Vercel domain (e.g. your-app.vercel.app, preview branches)
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch {}

    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

// Additional fallback aliases for direct /api/register and /api/login endpoints
app.options('/api/register', (req, res) => res.sendStatus(200));
app.options('/api/register/', (req, res) => res.sendStatus(200));
app.post('/api/register', authController.register);
app.post('/api/register/', authController.register);

app.options('/api/login', (req, res) => res.sendStatus(200));
app.options('/api/login/', (req, res) => res.sendStatus(200));
app.post('/api/login', authController.login);
app.post('/api/login/', authController.login);

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

// Start server — bind to 0.0.0.0 for Render/cloud compatibility
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 SCHOLARO Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`👉 Health Check: /api/health`);
    console.log(`🌐 Allowed CORS Origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'All (no FRONTEND_URL set)'}`);

    // Test Database Connection
    await testConnection();
  });
}

module.exports = app;
