import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Middleware
app.use(express.json());

// Test endpoints
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    port: PORT,
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API endpoint working!',
    cors: 'working',
    origin: req.headers.origin
  });
});

// Simple auth test endpoint
app.post('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth endpoint working!',
    receivedData: req.body
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API test: http://localhost:${PORT}/api/test`);
  console.log(`✅ CORS enabled for frontend origins`);
});

export default app;
