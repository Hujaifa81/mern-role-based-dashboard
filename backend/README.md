# MERN Role-Based Dashboard Backend

A comprehensive, production-ready backend API for a role-based dashboard system built with MongoDB, Express, TypeScript, and Node.js.

## 🌟 Key Features

### 🔐 Authentication & Authorization
- **Multi-Authentication Support**: Local (email/password) and Google OAuth 2.0
- **JWT-Based**: Access and refresh token system with secure httpOnly cookies
- **Role-Based Access Control (RBAC)**: Three roles (USER, MODERATOR, ADMIN) with granular permissions
- **Password Management**: Change password, forgot password, reset password flows
- **Session Management**: Express sessions with Passport.js

### 📊 Dashboard Analytics
- **User Statistics**: Total, active, suspended, verified, and unverified user counts
- **Role Distribution**: Aggregated data perfect for pie charts
- **Registration Trends**: Daily registration counts for line/bar charts
- **Month-over-Month Comparison**: New users with percentage change calculations
- **Status Distribution**: Active vs suspended user analysis
- **Recent Users**: Latest registered users for dashboard widgets

### 📝 Activity Logging System
- **Comprehensive Tracking**: 13 activity types covering all critical operations
- **Automatic Logging**: Login, logout, password changes tracked automatically
- **Audit Trail**: Track WHO did WHAT, WHEN, and from WHERE (IP + User Agent)
- **Admin Actions**: Special tracking for admin operations on other users
- **Advanced Filtering**: Filter by user, date range, activity type
- **RBAC Integration**: Users see only their own logs, admins see everything

### 👥 User Management
- **CRUD Operations**: Complete user lifecycle management
- **Advanced Query Builder**: Search, filter, sort, paginate across all endpoints
- **Data Validation**: Zod schemas with custom error messages
- **Email Verification**: OTP-based email verification system
- **Profile Management**: Self-service profile updates with proper authorization

### 🛡️ Security Features
- **Password Hashing**: bcrypt with salt rounds
- **HttpOnly Cookies**: XSS protection for tokens
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive Zod schemas
- **Error Handling**: Custom error classes with proper status codes
- **Rate Limiting Ready**: Infrastructure supports rate limiting middleware

### 📁 File Management
- **Image Upload**: Multer integration
- **Cloud Storage**: Cloudinary integration for scalable storage
- **Type Validation**: File type and size restrictions

### 📧 Email System
- **Nodemailer Integration**: Professional email service
- **EJS Templates**: Beautiful, responsive email templates
- **OTP Verification**: Secure one-time password system

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mern-role-based-dashboard/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/role-based-dashboard

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret_here
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Session
EXPRESS_SESSION_SECRET=your_session_secret_here

# Frontend
FRONTEND_URL=http://localhost:3000

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@example.com
```

4. **Seed the database** (optional but recommended for demo)
```bash
npm run seed
```

This will create:
- 1 Admin user (admin@example.com / Admin@123)
- 1 Moderator user (moderator@example.com / Moderator@123)
- 6 Regular users (john@example.com / User@123)
- 100+ activity logs spanning 30 days

5. **Start the development server**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/auth/login` | Login with credentials | No | - |
| GET | `/auth/google` | Initiate Google OAuth | No | - |
| GET | `/auth/google/callback` | Google OAuth callback | No | - |
| POST | `/auth/refresh-token` | Get new access token | No | - |
| POST | `/auth/change-password` | Change password | Yes | Any |
| POST | `/auth/forgot-password` | Request password reset | No | - |
| POST | `/auth/reset-password` | Reset password with token | No | - |
| POST | `/auth/set-password` | Set password (OAuth users) | Yes | Any |
| POST | `/auth/logout` | Logout user | Yes | Any |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/users` | Create new user | Yes | Admin |
| GET | `/users` | Get all users | Yes | Admin, Moderator |
| GET | `/users/me` | Get current user profile | Yes | Any |
| GET | `/users/:id` | Get user by ID | Yes | Admin, Moderator |
| PATCH | `/users/:id` | Update user | Yes | Self/Admin |

### Analytics Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard-overview` | Complete dashboard data |
| GET | `/analytics/user-stats` | User statistics |
| GET | `/analytics/role-distribution` | Users by role (pie chart data) |
| GET | `/analytics/registration-trends?days=30` | Daily registrations (chart data) |
| GET | `/analytics/new-users-month` | Month comparison with % change |
| GET | `/analytics/status-distribution` | Active vs suspended |
| GET | `/analytics/recent-users?limit=5` | Latest registered users |

### Activity Log Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/activity-logs` | Get all activity logs | Yes | Admin |
| GET | `/activity-logs/my-activity` | Get own activity logs | Yes | Any |
| GET | `/activity-logs/recent?limit=10` | Recent activities | Yes | Admin |
| GET | `/activity-logs/type/:type` | Filter by activity type | Yes | Admin |
| GET | `/activity-logs/user/:userId` | Get user's activities | Yes | Admin |
| DELETE | `/activity-logs/cleanup?days=90` | Delete old logs | Yes | Admin |

For detailed API documentation, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── config/           # Configuration files
│   │   │   ├── index.ts      # Environment variables
│   │   │   └── passport.ts   # Passport strategies
│   │   ├── errorHelpers.ts/  # Error handling utilities
│   │   │   ├── appError.ts
│   │   │   ├── zodErrorHandler.ts
│   │   │   ├── mongooseErrorHandler.ts
│   │   │   └── index.ts
│   │   ├── interfaces/       # Global TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── middlewares/      # Express middlewares
│   │   │   ├── checkAuth.ts      # Authentication & authorization
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   ├── validateRequest.ts
│   │   │   └── index.ts
│   │   ├── modules/          # Feature modules
│   │   │   ├── activityLog/
│   │   │   │   ├── activityLog.interface.ts
│   │   │   │   ├── activityLog.model.ts
│   │   │   │   ├── activityLog.service.ts
│   │   │   │   ├── activityLog.controller.ts
│   │   │   │   └── activityLog.routes.ts
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.service.ts
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   └── analytics.routes.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.validation.ts
│   │   │   └── user/
│   │   │       ├── user.interface.ts
│   │   │       ├── user.model.ts
│   │   │       ├── user.service.ts
│   │   │       ├── user.controller.ts
│   │   │       ├── user.routes.ts
│   │   │       ├── user.validation.ts
│   │   │       └── user.constants.ts
│   │   ├── routes/           # Route aggregation
│   │   │   └── index.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── activityLogger.ts
│   │   │   ├── bcryptHelper.ts
│   │   │   ├── catchAsync.ts
│   │   │   ├── cookieHelper.ts
│   │   │   ├── corsOptions.ts
│   │   │   ├── jwtHelper.ts
│   │   │   ├── queryBuilder.ts
│   │   │   ├── sendEmail.ts
│   │   │   ├── sendOtp.ts
│   │   │   ├── sendResponse.ts
│   │   │   └── index.ts
│   │   └── views/            # Email templates
│   │       └── otpEmail.ejs
│   ├── scripts/              # Utility scripts
│   │   └── seedDatabase.ts   # Database seeder
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── API_ENDPOINTS.md          # Detailed API documentation
├── INTERVIEW_DEMO_GUIDE.md   # Interview preparation guide
└── README.md                 # This file
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Database
npm run seed         # Seed database with sample data

# Testing
npm test             # Run tests (not yet implemented)
```

---

## 🎯 Technology Stack

### Core
- **Node.js** (v16+)
- **Express** (v5.1.0)
- **TypeScript** (v5.8.3)
- **MongoDB** (v5+) with **Mongoose** (v8.16.1)

### Authentication
- **Passport.js** (Local & Google OAuth strategies)
- **jsonwebtoken** (v9.0.2)
- **bcryptjs** (v3.0.2)

### Validation
- **Zod** (v3.25.74)

### File Upload
- **multer** (file handling)
- **cloudinary** (cloud storage)

### Email
- **nodemailer** (v7.0.5)
- **ejs** (v3.1.10) - email templates

### Development Tools
- **ts-node-dev** - TypeScript development with hot reload
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🔑 Key Concepts

### Role-Based Access Control (RBAC)

Three roles with different permission levels:

1. **USER**: Basic access
   - View and update own profile
   - Change own password
   - View own activity logs

2. **MODERATOR**: Extended access
   - All USER permissions
   - View all users
   - View all activity logs

3. **ADMIN**: Full access
   - All MODERATOR permissions
   - Create/update/delete users
   - Change user roles
   - Suspend/activate accounts
   - Access analytics dashboard
   - Cleanup old activity logs

### Activity Types

The system tracks 13 types of activities:

1. `USER_LOGIN` - User logged in
2. `USER_LOGOUT` - User logged out
3. `USER_REGISTER` - New user registered
4. `USER_CREATED` - Admin created a user
5. `USER_UPDATED` - User profile updated
6. `USER_DELETED` - User account deleted
7. `USER_SUSPENDED` - Account suspended
8. `USER_ACTIVATED` - Account activated
9. `ROLE_CHANGED` - User role changed
10. `PASSWORD_CHANGED` - Password changed
11. `PASSWORD_RESET` - Password reset via email
12. `EMAIL_VERIFIED` - Email verified
13. `PROFILE_UPDATED` - Profile information updated

### Query Builder Features

All list endpoints support advanced querying:

- **Search**: `?searchTerm=john` - Search in specified fields
- **Filter**: `?role=USER&status=ACTIVE` - Exact match filtering
- **Sort**: `?sortBy=createdAt&sortOrder=desc` - Flexible sorting
- **Pagination**: `?page=1&limit=10` - Offset pagination
- **Date Range**: `?startDate=2024-01-01&endDate=2024-12-31` - Filter by date
- **Field Selection**: `?fields=name,email` - Specify returned fields

Example:
```
GET /api/v1/users?role=USER&status=ACTIVE&searchTerm=john&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

---

## 🔒 Security Best Practices

1. **Password Security**
   - bcrypt hashing with salt
   - Minimum 8 characters
   - Requires uppercase, lowercase, number, and special character

2. **Token Security**
   - JWT stored in httpOnly cookies (XSS protection)
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Secure and sameSite cookie attributes in production

3. **Input Validation**
   - Zod schemas for all inputs
   - Custom error messages
   - Type safety with TypeScript

4. **Error Handling**
   - No sensitive data in error responses
   - Proper HTTP status codes
   - Centralized error handling

5. **Database Security**
   - Mongoose parameterized queries (SQL injection protection)
   - Password field excluded from queries by default
   - Input sanitization

6. **CORS Configuration**
   - Whitelist specific origins
   - Credentials enabled for cookie handling
   - Proper preflight handling

---

## 📊 Database Schema

### User Model
```typescript
{
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  isVerified: boolean;
  profilePicture?: string;
  auths: [{ provider: string; providerId: string }];
  otp?: { code: string; expiresAt: Date };
  passwordResetToken?: { token: string; expiresAt: Date };
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity Log Model
```typescript
{
  user: ObjectId;           // Who performed the action
  activityType: ActivityType;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  targetUser?: ObjectId;    // For admin actions on other users
  metadata?: object;        // Additional context
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Deployment

### Build for Production

1. **Compile TypeScript**
```bash
npm run build
```

2. **Set environment to production**
```env
NODE_ENV=production
```

3. **Start the server**
```bash
npm start
```

### Deployment Checklist

- [ ] Update `FRONTEND_URL` in `.env`
- [ ] Set strong secrets for JWT and sessions
- [ ] Configure MongoDB connection string
- [ ] Set up Google OAuth credentials for production
- [ ] Configure Cloudinary for file uploads
- [ ] Set up email service (Gmail, SendGrid, etc.)
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up logging (Winston, Morgan)
- [ ] Configure monitoring (Sentry, New Relic)
- [ ] Set up automated backups for MongoDB

---

## 📈 Performance Optimizations

1. **Database Indexes**
   - User: email, role, status, createdAt
   - ActivityLog: user+createdAt, activityType+createdAt, targetUser+createdAt

2. **Query Optimization**
   - Selective field projection
   - Pagination to limit result sets
   - Aggregation pipelines for analytics

3. **Caching (Future Enhancement)**
   - Redis for frequently accessed data
   - Cache analytics results
   - Session storage in Redis

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or with MongoDB Compass, connect to:
mongodb://localhost:27017
```

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5000 (Mac/Linux)
lsof -i :5000
kill -9 <PID>
```

### Google OAuth Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Check `GOOGLE_CALLBACK_URL` matches Google Console settings
- Ensure frontend URL is whitelisted in Google Console

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Built with ❤️ for demonstrating full-stack development skills

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the [API Documentation](./API_ENDPOINTS.md)
- Review the [Interview Demo Guide](./INTERVIEW_DEMO_GUIDE.md)

---

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- TypeScript best practices
- MongoDB aggregation pipelines
- JWT authentication
- OAuth 2.0 implementation
- Role-based authorization
- Input validation with Zod
- Error handling patterns
- File upload handling
- Email service integration
- Activity logging and auditing

Perfect for:
- Job interviews
- Portfolio projects
- Learning modern backend development
- Understanding production-ready architecture

---

**Happy Coding! 🚀**
