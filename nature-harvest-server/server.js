const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const productRoutes = require('./routes/products');
const quotesRouter = require('./routes/quotes');
const supplierRoutes = require('./routes/suppliers');
const serviceRoutes = require('./routes/services');
const brandRoutes = require('./routes/brands');
const categoryRoutes = require('./routes/categories');
const subcategoryRoutes = require('./routes/subcategories');
const flavorRoutes = require('./routes/flavors');
const sizeRoutes = require('./routes/sizes');
const dashboardRoutes = require('./routes/dashboard');

// Load environment variables
dotenv.config();

const app = express();

// Middleware - CORS must be first!
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://nature-harvest-dashboard.vercel.app',
      'https://nature-harvest-q2ra.vercel.app',
      'https://admin.wingzimpex.com',
      'https://wingzimpex.osamaqaseem.online',
      'https://nature-harvest-sooty.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:5000',
      'http://localhost:5001',
      'http://localhost:8000',
      'http://localhost:8080'
    ];
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'x-auth-token',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token'
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Also add a pre-flight middleware to ensure headers are set
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://nature-harvest-dashboard.vercel.app',
    'https://nature-harvest-sooty.vercel.app',
    'https://nature-harvest-q2ra.vercel.app',
    'https://admin.wingzimpex.com',
    'https://wingzimpex.osamaqaseem.online',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:5000',
    'http://localhost:5001',
    'http://localhost:8000',
    'http://localhost:8080'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Temporarily allow all origins for debugging
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  next();
});

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check MongoDB connection middleware - Modified to be less strict
app.use((req, res, next) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  // Only block critical operations, allow health checks and basic routes
  if (req.path === '/' || req.path === '/health' || req.path === '/api-docs') {
    return next();
  }
  
  if (state !== 1) {
    console.error('MongoDB not connected. Current state:', states[state] || 'unknown');
    console.error('Connection details:', {
      state: states[state] || 'unknown',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown',
      port: mongoose.connection.port || 'unknown'
    });
    
    // For API routes, return 503 but don't block health checks
    if (req.path.startsWith('/api/')) {
      return res.status(503).json({ 
        message: 'Database connection not ready',
        state: states[state] || 'unknown',
        details: {
          host: mongoose.connection.host || 'unknown',
          name: mongoose.connection.name || 'unknown',
          port: mongoose.connection.port || 'unknown'
        }
      });
    }
  }
  next();
});

// Handle OPTIONS requests
app.options('*', cors());

// Swagger documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));
}

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      return false;
    }
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Hide credentials in logs

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 1, // Reduced minimum pool size
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000, // Increased connection timeout
      heartbeatFrequencyMS: 10000, // Increased heartbeat frequency
      retryReads: true
    };

    await mongoose.connect(mongoURI, options);
    console.log('✨ MongoDB Connected Successfully!');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    global.mongoConnected = true;
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      state: mongoose.connection.readyState
    });
    global.mongoConnected = false;
    return false;
  }
};

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  global.mongoConnected = true;
  console.log('🔄 MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  global.mongoConnected = false;
  console.error('🔴 MongoDB connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

mongoose.connection.on('disconnected', () => {
  global.mongoConnected = false;
  console.log('🔸 MongoDB connection disconnected');
  // Attempt to reconnect
  setTimeout(connectDB, 5000);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotes', quotesRouter);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/flavors', flavorRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/partners', require('./routes/partners'));
app.use('/api/careers', require('./routes/careers'));

// Upload routes with increased timeout
const { uploadMultiple } = require('./middleware/externalUpload');
app.post('/api/upload', (req, res, next) => {
  // Set timeout for upload requests (5 minutes)
  req.setTimeout(300000, () => {
    res.status(408).json({
      success: false,
      message: 'Upload request timed out. Please try again with smaller files.'
    });
  });
  next();
}, uploadMultiple('file', 10, 'products'), (req, res) => {
  try {
    if (!req.uploadResults || req.uploadResults.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        urls: req.fileUrls,
        files: req.uploadResults
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});
app.use('/uploads/products', express.static(path.join(__dirname, '../uploads/products')));
app.use('/uploads/brochures', express.static(path.join(__dirname, '../uploads/brochures')));
app.use('/uploads/brand-category', express.static(path.join(__dirname, '../uploads/brand-category')));
app.use('/uploads/flavors', express.static(path.join(__dirname, '../uploads/flavors')));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Check the health status of the API and database connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health check successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy]
 *                   description: Overall API health status
 *                 message:
 *                   type: string
 *                   description: Health status message
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Current timestamp
 *                 mongodb:
 *                   type: object
 *                   properties:
 *                     isConnected:
 *                       type: boolean
 *                       description: MongoDB connection status
 *                     state:
 *                       type: string
 *                       description: MongoDB connection state
 *                     database:
 *                       type: string
 *                       description: Database name
 *                     host:
 *                       type: string
 *                       description: Database host
 *                     port:
 *                       type: string
 *                       description: Database port
 *                     models:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Available models
 *                     collections:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Available collections
 *                 server:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *                     memory:
 *                       type: object
 *                       description: Memory usage statistics
 *                     cpu:
 *                       type: object
 *                       description: CPU usage statistics
 *                     env:
 *                       type: string
 *                       description: Environment name
 *                     nodeVersion:
 *                       type: string
 *                       description: Node.js version
 *                     platform:
 *                       type: string
 *                       description: Platform information
 *       503:
 *         description: Service unavailable - database not connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database connection not ready"
 *                 state:
 *                   type: string
 *                   description: Database connection state
 *                 details:
 *                   type: object
 *                   description: Connection details
 */
// Health check endpoint
app.get('/health', (req, res) => {
  const mongoStatus = {
    isConnected: mongoose.connection.readyState === 1,
    state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    database: mongoose.connection.name || 'not connected',
    host: mongoose.connection.host || 'not connected',
    port: mongoose.connection.port || 'not connected',
    models: Object.keys(mongoose.models),
    collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections) : []
  };

  const serverStatus = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    env: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform
  };

  res.json({ 
    status: mongoStatus.isConnected ? 'healthy' : 'unhealthy',
    message: mongoStatus.isConnected ? 'Server is running' : 'Server is running but database is not connected',
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
    server: serverStatus
  });
});

// Root route for API health check
app.get('/', (req, res) => {
  const mongoStatus = {
    isConnected: mongoose.connection.readyState === 1,
    state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    database: mongoose.connection.name || 'not connected',
    host: mongoose.connection.host || 'not connected',
    port: mongoose.connection.port || 'not connected',
    models: Object.keys(mongoose.models),
    collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections) : []
  };

  const serverStatus = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    env: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform
  };

  res.json({ 
    status: mongoStatus.isConnected ? 'healthy' : 'unhealthy',
    message: mongoStatus.isConnected ? 'Server is running' : 'Server is running but database is not connected',
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
    server: serverStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server only after MongoDB connection is established
const startServer = async () => {
  let retries = 5;
  let connected = false;

  console.log('🚀 Starting Nature Harvest Server...');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Port: ${process.env.PORT || 3002}`);

  while (retries > 0 && !connected) {
    console.log(`Attempting to connect to MongoDB (${retries} retries left)...`);
    connected = await connectDB();
    if (!connected) {
      retries--;
      if (retries > 0) {
        console.log('Waiting 10 seconds before retrying...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }

  if (!connected) {
    console.error('❌ Failed to connect to MongoDB after multiple attempts');
    console.log('⚠️  Server will start but API endpoints will return 503 errors');
    console.log('💡 Check your MongoDB connection string and network connectivity');
    
    // Start server anyway but log the issue
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} (Database not connected)`);
      console.log(`📊 Health check available at /health`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📚 Swagger documentation available at /api-docs`);
      }
      console.log('⚠️  API endpoints will return 503 errors until database connects');
    });
    return;
  }

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check available at /health`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📚 Swagger documentation available at /api-docs`);
    }
  });
};

// Start the server
startServer(); 