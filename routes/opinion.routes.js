const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinion.controller');
const { authUser } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', opinionController.getAllOpinions);
router.get('/:id', opinionController.getOpinion);

// Protected routes
router.post('/', authUser, opinionController.createOpinion);
router.post('/:id/vote', authUser, opinionController.voteOpinion);
router.delete('/:id', authUser, opinionController.deleteOpinion);

module.exports = router;
