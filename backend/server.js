import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Import database and models
import { connectDB } from './config/database.js';
import './models/index.js'; // This will set up associations

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import savedPostRoutes from './routes/savedPostRoutes.js';
import userRoutes from './routes/userRoutes.js';
import voteRoutes from './routes/voteRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    }
  }
})); // Security headers
app.use(compression()); // Gzip compression
app.use(limiter); // Rate limiting
app.use(morgan('combined')); // HTTP request logger

// Debug CORS requests
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} from origin: ${req.headers.origin}`);
  next();
});

// Handle preflight requests for all routes
app.options('*', cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for uploads with CORS headers
// Serve static files for uploads with specific CORS
app.use('/uploads', cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: false,
  methods: ['GET', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Cache-Control'],
}), (req, res, next) => {
  // Add additional headers for cross-origin images
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static('uploads', {
  maxAge: '1d', // Cache for 1 day
  etag: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Whisper Box API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    cors: 'enabled'
  });
});

// Simple CORS test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// API endpoint to serve profile images
app.get('/api/images/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(process.cwd(), 'uploads', 'profile-images', filename);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }
  
  // Set appropriate headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // Send the file
  res.sendFile(imagePath);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes); // Comments are nested under posts
app.use('/api/posts', voteRoutes); // Votes are nested under posts
app.use('/api/saved-posts', savedPostRoutes);
app.use('/api/users', userRoutes);

// Catch-all for undefined routes
app.use('*', notFound);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
