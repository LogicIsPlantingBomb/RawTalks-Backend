const Comment = require('../models/commentModel');
const Opinion = require('../models/opinionModel');

exports.createComment = async (req, res) => {
  try {
    const { content, opinionId } = req.body;
    
    // Check if opinion exists
    const opinion = await Opinion.findById(opinionId);
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found'
      });
    }
    
    const newComment = new Comment({
      content,
      author: req.user.id,
      opinion: opinionId
    });
    
    await newComment.save();
    
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCommentsByOpinion = async (req, res) => {
  try {
    const comments = await Comment.find({ opinion: req.params.opinionId })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.voteComment = async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    const userId = req.user.id;
    
    // Check if user has already voted
    const hasUpvoted = comment.upvotes.includes(userId);
    const hasDownvoted = comment.downvotes.includes(userId);
    
    // Handle upvote
    if (type === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote if already upvoted
        comment.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        comment.upvotes.push(userId);
        if (hasDownvoted) {
          comment.downvotes.pull(userId);
        }
      }
    } 
    // Handle downvote
    else if (type === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote if already downvoted
        comment.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        comment.downvotes.push(userId);
        if (hasUpvoted) {
          comment.upvotes.pull(userId);
        }
      }
    }
    
    await comment.save();
    
    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if the user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }
    
    await Comment.deleteOne({ _id: comment._id });
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
