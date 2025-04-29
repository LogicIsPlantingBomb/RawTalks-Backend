// middlewares/socketAuth.middleware.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const blacklistTokenModel = require('../models/blacklistToken.model');

const socketAuthMiddleware = async (socket, next) => {
  try {
    // Get token from handshake
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    // Check if token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return next(new Error('Authentication error: Token is invalidated'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    
    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: ' + error.message));
  }
};

module.exports = socketAuthMiddleware;
