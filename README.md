# TruthStream Backend API

A robust Node.js backend API for the TruthStream opinion-sharing platform, handling user authentication, opinion management, comments, and voting functionality.

## Overview

The TruthStream backend is built using Node.js and Express, providing RESTful API endpoints that support all the functionality of the TruthStream platform:
- User authentication (registration, login)
- Opinion creation and retrieval
- Comment management
- Voting system (upvotes/downvotes)
- User profile management

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **cors** - Cross-Origin Resource Sharing

## API Structure

```
/
├── server.js          # Entry point
├── config/            # Configuration files
│   └── db.js          # Database connection
├── controllers/       # Request handlers
│   ├── authController.js
│   ├── opinionController.js
│   ├── commentController.js
│   └── userController.js
├── middleware/        # Custom middleware
│   ├── auth.js        # Authentication middleware
│   └── error.js       # Error handling middleware
├── models/            # Database schemas
│   ├── User.js
│   ├── Opinion.js
│   └── Comment.js
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── opinionRoutes.js
│   ├── commentRoutes.js
│   └── userRoutes.js
└── utils/             # Utility functions
    ├── errorResponse.js
    └── validators.js
```

## Data Models

### User Model
```javascript
{
  fullname: {
    firstname: String,
    lastname: String
  },
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Opinion Model
```javascript
{
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  commentCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  opinionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opinion' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login | User login |
| GET    | /api/auth/logout | User logout |
| GET    | /api/auth/me | Get current user info |

### Opinions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/opinions | Get all opinions |
| GET    | /api/opinions/:id | Get a specific opinion |
| POST   | /api/opinions | Create a new opinion |
| DELETE | /api/opinions/:id | Delete an opinion |
| POST   | /api/opinions/:id/vote | Vote on an opinion |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/comments/opinion/:id | Get comments for an opinion |
| POST   | /api/comments | Create a new comment |
| DELETE | /api/comments/:id | Delete a comment |
| POST   | /api/comments/:id/vote | Vote on a comment |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/users/profile | Get user profile |
| PUT    | /api/users/profile | Update user profile |
| GET    | /api/users/:id/opinions | Get opinions by a specific user |

## Authentication Flow

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server validates credentials and returns a JWT token
3. Client stores the token (usually in localStorage)
4. Client includes the token in the Authorization header for protected requests
5. Server middleware validates the token before allowing access to protected routes

## Vote Handling

The voting system allows users to upvote or downvote opinions and comments:

- Each user can have only one vote per opinion/comment
- Voting again toggles the vote off
- Voting in the opposite direction switches the vote type
- Vote counts are tracked in upvotes and downvotes arrays

## Error Handling

The API includes standardized error responses:

- 400: Bad Request - Invalid input data
- 401: Unauthorized - Authentication failure
- 403: Forbidden - Not allowed to perform action
- 404: Not Found - Resource not found
- 500: Server Error - Internal server issue

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/truthstream.git
cd truthstream/backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/truthstream
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Development

### Running Tests
```bash
npm test
```

### Database Seeding
```bash
# Import sample data
npm run seed

# Clear database
npm run seed:delete
```

## Deployment

The API can be deployed to various platforms:

- **Heroku**: Use the provided Procfile
- **AWS/DigitalOcean**: Use PM2 for process management
- **Docker**: A Dockerfile is included for containerization

## Security Measures

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting on authentication routes
- CORS configuration for frontend access
- Environment variable management for sensitive data

## License

This project is licensed under the MIT License - see the LICENSE file for details.
