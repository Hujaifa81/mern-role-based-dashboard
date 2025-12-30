# MERN Role-Based Dashboard (Fullstack)

---

## 🌐 Live Demo & Admin Credentials

- **Backend Deploy:** [live Link](https://dashboard-backend-five-eosin.vercel.app)
- **Frontend Deploy:** [Live Link](https://dashboard-frontend-tau-lime.vercel.app/)

**Admin Credentials:**
- Email: abuhojaifa123@gmail.com
- Password: Hujaifa@1

---

## 🚀 Project Overview
A fullstack, production-ready role-based dashboard built with the MERN stack and TypeScript. This project features robust authentication, user management, analytics, file uploads, and a modern, responsive frontend. Designed for real-world SaaS/admin dashboards and interview demonstration.

---

## 🌟 Key Features

### 🏗️ Backend Architecture
- **Modular Structure:** Clean, scalable backend with feature-based modules (auth, user, analytics, OTP, activity log, etc.) for maintainability and separation of concerns.

---

### 🔐 Authentication & Authorization
- **Multi-Authentication Support:** Local (email/password) and Google OAuth 2.0 with Passport.js
- **JWT-Based:** Access and refresh token system with secure httpOnly cookies
- **Role-Based Access Control (RBAC):** Two roles (USER, ADMIN) with granular permissions
- **Password Management:** Change password, forgot password, reset password flows
- **Session Management:** Express sessions with Passport.js
- **OTP Email Verification:** Secure, Redis-backed OTP system for verifying user emails and critical actions
- **Reset Password Email System:** Secure password reset via email with expiring token links and EJS email templates

---

### 📊 Dashboard Analytics
- **User Statistics:** Total, active, suspended, verified, and unverified user counts
- **Role Distribution:** Aggregated data perfect for pie charts
- **Registration Trends:** Daily registration counts for line/bar charts
- **Month-over-Month Comparison:** New users with percentage change calculations
- **Status Distribution:** Active vs suspended user analysis
- **Recent Users:** Latest registered users for dashboard widgets

---

### 📝 Activity Logging System
- **Comprehensive Tracking:** 13 activity types covering all critical operations
- **Automatic Logging:** Login, logout, password changes tracked automatically
- **Audit Trail:** Track WHO did WHAT, WHEN, and from WHERE (IP + User Agent)
- **Admin Actions:** Special tracking for admin operations on other users
- **Advanced Filtering:** Filter by user, date range, activity type
- **RBAC Integration:** Users see only their own logs, admins see everything

---

### 👥 User Management
- **CRUD Operations:** Complete user lifecycle management
- **Advanced Query Builder:** Search, filter, sort, paginate across all endpoints
- **Data Validation:** Zod schemas with custom error messages
- **Profile Management:** Self-service profile updates with proper authorization, including profile picture change with secure image upload (Cloudinary)
- **Email Verification:** OTP-based email verification system for new users and sensitive operations

---

### 🛡️ Security Features
- **Password Hashing:** bcrypt with salt rounds
- **HttpOnly Cookies:** XSS protection for tokens
- **CORS Configuration:** Proper cross-origin resource sharing setup

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, TypeScript, MongoDB (Mongoose), Redis, Passport.js, Multer, Cloudinary, Nodemailer, Zod, EJS
- **Frontend:** Next.js, React 19, Shadcn, Tailwind CSS, React Hook Form, Zod, Radix UI, Recharts

---

### Query Builder Features

All list endpoints support advanced querying:

- **Search**: `?searchTerm=john` - Search in specified fields
- **Filter**: `?role=USER&status=ACTIVE` - Exact match filtering
- **Sort**: `?sortBy=createdAt&sortOrder=desc` - Flexible sorting
- **Pagination**: `?page=1&limit=10` - Offset pagination
- **Date Range**: `?startDate=2024-01-01&endDate=2024-12-31` - Filter by date
- **Field Selection**: `?fields=name,email` - Specify returned fields

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

## 📁 Folder Structure
```
mern-role-based-dashboard/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/         # Env, passport, cloudinary, etc.
│   │   │   ├── modules/        # auth, user, analytics, otp, activityLog
│   │   │   ├── utils/          # helpers, sendEmail, setCookie, etc.
│   │   │   ├── middlewares/    # error, auth, etc.
│   │   │   ├── routes/         # API route definitions
│   │   │   └── ...
│   │   ├── scripts/            # Seeders, utilities
│   │   └── server.ts           # Entry point
│   ├── dist/                   # Compiled output
│   ├── .env                    # Environment variables
│   ├── package.json            # Scripts & dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js app router structure
│   │   ├── components/         # UI and form components
│   │   ├── lib/                # API helpers, fetch logic
│   │   ├── services/           # API service functions
│   │   ├── types/              # TypeScript types
│   │   └── zod/                # Zod validation schemas
│   ├── public/                 # Static assets
│   ├── .env.local              # Frontend environment variables
│   ├── package.json            # Scripts & dependencies
│   └── README.md
└── README.md                   # (This file)
```

---

## 📦 Setup & Run (Fullstack)
1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd mern-role-based-dashboard
   ```
2. **Backend setup:**
   ```sh
   cd backend
   npm install
   # Copy .env.example to .env and fill in all secrets (MongoDB, JWT, SMTP, Redis, Cloudinary, etc.)
   npm run build
   npm start
   # For development: npm run dev
   # (Optional) Seed database: npm run seed
   ```
3. **Frontend setup:**
   ```sh
   cd ../frontend
   npm install
   # Copy .env.local.example to .env.local and set NEXT_PUBLIC_BASE_API_URL to your backend URL
   npm run dev
   # For production: npm run build && npm start
   ```

---

## 📚 Project Summary
See [backend/PROJECT_SUMMARY.md](backend/PROJECT_SUMMARY.md) for a deep-dive into design decisions, architecture, and feature checklists.

---

## 🧑‍💻 Author & License
- Built by [Md Abu Hujaifa]
- MIT License
