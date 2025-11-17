require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connectDB } = require('./database/connection');
const { connectRedis } = require('./database/redis');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const upiRoutes = require('./routes/upi');
const billPayRoutes = require('./routes/billPay');
const netWorthRoutes = require('./routes/netWorth');
const creditScoreRoutes = require('./routes/creditScore');
const mutualFundRoutes = require('./routes/mutualFunds');
const goldRoutes = require('./routes/gold');

// Import Middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.WEB_APP_URL || 'http://localhost:3001',
    process.env.MOBILE_APP_URL || 'myfi://'
  ],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'MYFI API',
    version: process.env.API_VERSION || 'v1'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', authenticateToken, userRoutes);
app.use('/api/v1/upi', authenticateToken, upiRoutes);
app.use('/api/v1/bills', authenticateToken, billPayRoutes);
app.use('/api/v1/networth', authenticateToken, netWorthRoutes);
app.use('/api/v1/credit-score', authenticateToken, creditScoreRoutes);
app.use('/api/v1/mutual-funds', authenticateToken, mutualFundRoutes);
app.use('/api/v1/gold', authenticateToken, goldRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error Handler
app.use(errorHandler);

// Initialize Server
async function startServer() {
  try {
    // Connect to PostgreSQL
    await connectDB();
    console.log('✅ PostgreSQL connected');

    // Connect to Redis
    await connectRedis();
    console.log('✅ Redis connected');

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 MYFI API Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

