const Opinion = require('../models/opinionModel');

exports.createOpinion = async (req, res) => {
  try {
    const { content } = req.body;
    
    const newOpinion = new Opinion({
      content,
      author: req.user.id
    });
    
    await newOpinion.save();
    
    res.status(201).json({
      success: true,
      data: newOpinion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllOpinions = async (req, res) => {
  try {
    const opinions = await Opinion.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.status(200).json({
      success: true,
      count: opinions.length,
      data: opinions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOpinion = async (req, res) => {
  try {
    const opinion = await Opinion.findById(req.params.id)
      .populate('author', 'username');
    
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: opinion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.voteOpinion = async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const opinion = await Opinion.findById(req.params.id);
    
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found'
      });
    }
    
    const userId = req.user.id;
    
    // Check if user has already voted
    const hasUpvoted = opinion.upvotes.includes(userId);
    const hasDownvoted = opinion.downvotes.includes(userId);
    
    // Handle upvote
    if (type === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote if already upvoted
        opinion.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        opinion.upvotes.push(userId);
        if (hasDownvoted) {
          opinion.downvotes.pull(userId);
        }
      }
    } 
    // Handle downvote
    else if (type === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote if already downvoted
        opinion.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        opinion.downvotes.push(userId);
        if (hasUpvoted) {
          opinion.upvotes.pull(userId);
        }
      }
    }
    
    await opinion.save();
    
    res.status(200).json({
      success: true,
      data: opinion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteOpinion = async (req, res) => {
  try {
    const opinion = await Opinion.findById(req.params.id);
    
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found'
      });
    }
    
    // Check if the user is the author
    if (opinion.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own opinions'
      });
    }
    
    await Opinion.deleteOne({ _id: opinion._id });
    
    res.status(200).json({
      success: true,
      message: 'Opinion deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
