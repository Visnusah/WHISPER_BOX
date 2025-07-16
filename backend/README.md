# Whisper Box Backend

A robust Node.js backend for the Whisper Box social media platform built with Express.js, Sequelize ORM, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with admin roles
- **User Management**: Complete user profiles and admin controls
- **Posts System**: Create, read, update, delete posts with voting
- **Comments System**: Nested comments with full CRUD operations
- **Saved Posts**: Users can save/bookmark posts
- **Real-time Voting**: Upvote/downvote posts with vote tracking
- **Admin Dashboard**: User management and platform statistics
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: PostgreSQL with Sequelize ORM

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- PgAdmin4 (optional, for database management)

## 🛠️ Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=whisper_box_db
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   
   PORT=5000
   NODE_ENV=development
   
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up PostgreSQL database**:
   
   Using psql:
   ```sql
   CREATE DATABASE whisper_box_db;
   ```
   
   Or using PgAdmin4:
   - Open PgAdmin4
   - Right-click on 'Databases'
   - Select 'Create' > 'Database'
   - Name: `whisper_box_db`

5. **Start the server**:
   ```bash
   npm run dev
   ```

6. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

## 🗄️ Database Schema

### Users
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `fullName` (String)
- `bio` (Text)
- `profileImage` (String, URL)
- `isAdmin` (Boolean)
- `isActive` (Boolean)
- `lastLogin` (Date)
- `createdAt`, `updatedAt` (Timestamps)

### Posts
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `hashtags` (Array of Strings)
- `votes` (Integer)
- `authorId` (UUID, Foreign Key)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Comments
- `id` (UUID, Primary Key)
- `text` (Text)
- `postId` (UUID, Foreign Key)
- `authorId` (UUID, Foreign Key)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Votes
- `id` (UUID, Primary Key)
- `postId` (UUID, Foreign Key)
- `userId` (UUID, Foreign Key)
- `voteType` (Enum: 'up', 'down')
- `createdAt`, `updatedAt` (Timestamps)

### SavedPosts
- `id` (UUID, Primary Key)
- `postId` (UUID, Foreign Key)
- `userId` (UUID, Foreign Key)
- `createdAt`, `updatedAt` (Timestamps)

## 🛡️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/logout` - User logout (protected)

### Posts
- `GET /api/posts` - Get all posts (optional auth)
- `GET /api/posts/trending` - Get trending posts (optional auth)
- `GET /api/posts/:id` - Get post by ID (optional auth)
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/vote` - Vote on post (protected)

### Comments
- `GET /api/posts/:postId/comments` - Get comments for post
- `POST /api/posts/:postId/comments` - Create comment (protected)
- `PUT /api/posts/:postId/comments/:commentId` - Update comment (protected)
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment (protected)

### Saved Posts
- `GET /api/saved-posts` - Get user's saved posts (protected)
- `POST /api/saved-posts/:postId` - Save post (protected)
- `DELETE /api/saved-posts/:postId` - Unsave post (protected)

### Users (Admin Only)
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/:id/toggle-status` - Toggle user status (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/users/admin/dashboard-stats` - Get dashboard stats (admin)

### Demo
- `GET /api/demo/users` - Get demo user accounts for testing

## 🧪 Demo Accounts

After running the seed script, you can use these demo accounts:

1. **Regular User**:
   - Email: `test@example.com`
   - Password: `password123`

2. **Admin User**:
   - Email: `admin@whisperbox.com`
   - Password: `admin123`

3. **Demo User**:
   - Email: `demo@example.com`
   - Password: `demo123`

4. **Tech User**:
   - Email: `adrien@example.com`
   - Password: `password123`

## 📜 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with demo data

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **JWT Authentication**: Secure token-based auth
- **SQL Injection Protection**: Sequelize ORM

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment
2. Update database credentials for production
3. Set secure JWT secret
4. Configure CORS for your frontend domain
5. Use a reverse proxy (nginx) in production
6. Enable SSL/HTTPS

## 🤝 API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": {
    // Response data
  },
  "error": "Error details (development only)"
}
```

## 🐛 Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists and is accessible

### Authentication Issues
1. Check JWT_SECRET is set
2. Verify token format: `Bearer <token>`
3. Check token expiration

### Permission Errors
1. Ensure user has correct role (admin/user)
2. Check user is active (`isActive: true`)

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Console logging for all requests (Morgan)
- Error logging with stack traces in development

## 🔗 Integration with Frontend

To integrate with your React frontend:

1. Update frontend API config:
   ```javascript
   const API_CONFIG = {
     BASE_URL: 'http://localhost:5000/api',
     USE_MOCK_DATA: false
   }
   ```

2. Update authentication to use JWT tokens
3. Handle API responses with the new format
4. Update error handling for the new error structure

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint documentation
3. Check console logs for detailed error messages
4. Verify environment configuration
