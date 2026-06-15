# Portfolio Auth Backend

A Node.js/Express backend server for portfolio authentication using SQLite database.

## Features

- User signup with email validation
- User login with JWT authentication
- Forgot password functionality with reset tokens
- Password hashing with bcryptjs
- CORS support for frontend communication
- SQLite database for user management

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

Update `.env` file with your settings:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Sign Up
- **POST** `/api/auth/signup`
- Body: `{ fullName, email, password, confirmPassword }`
- Returns: JWT token and user data

### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: JWT token and user data

### Forgot Password
- **POST** `/api/auth/forgot-password`
- Body: `{ email }`
- Returns: Reset token (in development)

### Reset Password
- **POST** `/api/auth/reset-password`
- Body: `{ token, newPassword, confirmPassword }`
- Returns: Success message

## Database

The app uses SQLite with two main tables:

### users
- id (PK)
- fullName
- email (unique)
- password (hashed)
- createdAt
- updatedAt

### password_resets
- id (PK)
- email (FK)
- token (unique)
- expiresAt
- createdAt

## Testing

Use a tool like Postman or curl to test the API endpoints. The frontend forms in the parent directory are configured to connect to these endpoints.

## Security Notes

- Always change `JWT_SECRET` in production
- Passwords are hashed using bcryptjs with 10 rounds
- Reset tokens expire after 1 hour
- CORS is enabled for localhost; configure for production
