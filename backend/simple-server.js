import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());

// Serve static files with CORS
app.use('/uploads', cors(), express.static('uploads'));

// Test endpoints
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server running!', port: PORT });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔧 Test: http://localhost:${PORT}/api/test`);
});

export default app;
