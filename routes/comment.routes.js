const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authUser } = require('../middlewares/auth.middleware');

// Public routes
router.get('/opinion/:opinionId', commentController.getCommentsByOpinion);

// Protected routes
router.post('/', authUser, commentController.createComment);
router.post('/:id/vote', authUser, commentController.voteComment);
router.delete('/:id', authUser, commentController.deleteComment);

module.exports = router;
