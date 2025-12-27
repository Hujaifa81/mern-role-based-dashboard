# API Endpoints Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication Routes (`/auth`)

### 1. Login with Credentials
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: User object + tokens
- **Activity Log**: USER_LOGIN

### 2. Google OAuth Login
- **GET** `/auth/google?state=redirect_path`
- **Response**: Redirects to frontend with cookies
- **Activity Log**: USER_LOGIN

### 3. Google OAuth Callback
- **GET** `/auth/google/callback`
- **Response**: Redirects to frontend

### 4. Get New Access Token
- **POST** `/auth/refresh-token`
- **Cookies**: refreshToken
- **Response**: New access token

### 5. Change Password
- **POST** `/auth/change-password`
- **Auth**: Required (Any role)
- **Body**: `{ oldPassword, newPassword }`
- **Response**: Success message
- **Activity Log**: PASSWORD_CHANGED

### 6. Forgot Password
- **POST** `/auth/forgot-password`
- **Body**: `{ email }`
- **Response**: Success message (email sent)

### 7. Reset Password
- **POST** `/auth/reset-password`
- **Body**: `{ token, userId, newPassword }`
- **Response**: Success message
- **Activity Log**: PASSWORD_RESET

### 8. Set Password (OAuth users)
- **POST** `/auth/set-password`
- **Auth**: Required
- **Body**: `{ password }`
- **Response**: Success message

### 9. Logout
- **POST** `/auth/logout`
- **Auth**: Required
- **Response**: Success message
- **Activity Log**: USER_LOGOUT

---

## User Routes (`/users`)

### 1. Create User
- **POST** `/users`
- **Auth**: Admin only
- **Body**: `{ name, email, password, phone?, role? }`
- **Response**: Created user
- **Activity Log**: USER_CREATED

### 2. Get All Users
- **GET** `/users`
- **Auth**: Admin/Moderator
- **Query Params**: 
  - `searchTerm`: Search in name/email
  - `role`: Filter by role
  - `status`: Filter by status
  - `isVerified`: Filter by verification
  - `sortBy`: Field to sort by
  - `sortOrder`: asc/desc
  - `limit`: Items per page (default: 10)
  - `page`: Page number (default: 1)
  - `startDate`: Filter from date
  - `endDate`: Filter to date
- **Response**: Users array + pagination meta

### 3. Get Single User
- **GET** `/users/:id`
- **Auth**: Admin/Moderator
- **Response**: User object

### 4. Get My Profile
- **GET** `/users/me`
- **Auth**: Required (Any role)
- **Response**: Current user's profile

### 5. Update User
- **PATCH** `/users/:id`
- **Auth**: Required
  - Users can only update themselves
  - Admin can update anyone
- **Body**: `{ name?, phone?, role?, status?, isVerified? }`
- **Response**: Updated user
- **Activity Logs**: 
  - USER_UPDATED (general)
  - ROLE_CHANGED (if role updated)
  - USER_SUSPENDED (if status = SUSPENDED)
  - USER_ACTIVATED (if status = ACTIVE)
  - EMAIL_VERIFIED (if isVerified updated)

---

## Analytics Routes (`/analytics`)

All analytics routes require **Admin** authentication.

### 1. Dashboard Overview
- **GET** `/analytics/dashboard-overview`
- **Auth**: Admin only
- **Response**: Combined dashboard data
  ```json
  {
    "userStats": {
      "total": 100,
      "active": 85,
      "suspended": 5,
      "verified": 80,
      "unverified": 20
    },
    "roleDistribution": [
      { "_id": "USER", "count": 80 },
      { "_id": "MODERATOR", "count": 15 },
      { "_id": "ADMIN", "count": 5 }
    ],
    "registrationTrends": [...],
    "newUsersThisMonth": {
      "currentMonth": 25,
      "previousMonth": 20,
      "percentageChange": 25
    },
    "statusDistribution": {...},
    "recentUsers": [...]
  }
  ```

### 2. User Statistics
- **GET** `/analytics/user-stats`
- **Auth**: Admin only
- **Response**: Total, active, suspended, verified, unverified counts

### 3. Role Distribution
- **GET** `/analytics/role-distribution`
- **Auth**: Admin only
- **Response**: Array of role counts (for pie charts)

### 4. Registration Trends
- **GET** `/analytics/registration-trends?days=30`
- **Auth**: Admin only
- **Query Params**: `days` (default: 30)
- **Response**: Daily registration counts (for line/bar charts)

### 5. New Users This Month
- **GET** `/analytics/new-users-month`
- **Auth**: Admin only
- **Response**: Current vs previous month with percentage change

### 6. Status Distribution
- **GET** `/analytics/status-distribution`
- **Auth**: Admin only
- **Response**: Active vs Suspended counts

### 7. Recent Users
- **GET** `/analytics/recent-users?limit=5`
- **Auth**: Admin only
- **Query Params**: `limit` (default: 5)
- **Response**: Latest registered users

---

## Activity Log Routes (`/activity-logs`)

### 1. Get All Activity Logs
- **GET** `/activity-logs`
- **Auth**: Admin only
- **Query Params**: 
  - `searchTerm`: Search in description/activityType
  - `activityType`: Filter by activity type
  - `user`: Filter by user ID
  - `targetUser`: Filter by target user ID
  - `sortBy`: Field to sort by
  - `sortOrder`: asc/desc
  - `limit`: Items per page (default: 10)
  - `page`: Page number (default: 1)
  - `startDate`: Filter from date
  - `endDate`: Filter to date
- **Response**: Activity logs array + pagination meta

### 2. Get Recent Activity Logs
- **GET** `/activity-logs/recent?limit=10`
- **Auth**: Admin only
- **Query Params**: `limit` (default: 10)
- **Response**: Most recent activity logs

### 3. Get Activity Logs by Type
- **GET** `/activity-logs/type/:type`
- **Auth**: Admin only
- **Params**: `type` (e.g., USER_LOGIN, USER_CREATED, etc.)
- **Query Params**: Same as Get All
- **Response**: Filtered activity logs

### 4. Get User Activity Logs
- **GET** `/activity-logs/user/:userId`
- **Auth**: Admin only
- **Params**: `userId`
- **Query Params**: Same as Get All
- **Response**: Activity logs for specific user

### 5. Get My Activity Logs
- **GET** `/activity-logs/my-activity`
- **Auth**: Required (Any role)
- **Query Params**: Same as Get All
- **Response**: Current user's activity logs

### 6. Delete Old Activity Logs
- **DELETE** `/activity-logs/cleanup?days=90`
- **Auth**: Admin only
- **Query Params**: `days` (default: 90)
- **Response**: Number of deleted logs

---

## Activity Types

Activity logs automatically track the following events:

1. **USER_LOGIN**: User logged in (local or OAuth)
2. **USER_LOGOUT**: User logged out
3. **USER_REGISTER**: New user registered
4. **USER_CREATED**: Admin created a new user
5. **USER_UPDATED**: User profile updated
6. **USER_DELETED**: User account deleted
7. **USER_SUSPENDED**: User account suspended
8. **USER_ACTIVATED**: User account activated
9. **ROLE_CHANGED**: User role changed
10. **PASSWORD_CHANGED**: User changed password
11. **PASSWORD_RESET**: User reset password via email
12. **EMAIL_VERIFIED**: Email verified
13. **PROFILE_UPDATED**: User profile updated

---

## Status Codes

- **200 OK**: Successful request
- **201 CREATED**: Resource created successfully
- **400 BAD_REQUEST**: Invalid request data
- **401 UNAUTHORIZED**: Authentication required or invalid
- **403 FORBIDDEN**: Insufficient permissions
- **404 NOT_FOUND**: Resource not found
- **409 CONFLICT**: Resource already exists
- **500 INTERNAL_SERVER_ERROR**: Server error

---

## Authentication

Most routes require authentication via JWT tokens stored in cookies:
- `accessToken`: Short-lived token (15 minutes)
- `refreshToken`: Long-lived token (7 days)

Include these cookies in your requests or send the access token in the `Authorization` header:
```
Authorization: Bearer <accessToken>
```

---

## Role-Based Access

- **USER**: Can view/update own profile, view own activity logs
- **MODERATOR**: Can view all users, view all activity logs
- **ADMIN**: Full access to all endpoints including analytics, user management, and activity log cleanup
