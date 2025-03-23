const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const sessionController = require('../controllers/sessionController');

// Protected routes for managing teaching sessions
router.post('/create', protect, sessionController.createSession);
router.get('/my-sessions', protect, sessionController.getMySessions);
router.get('/:id', protect, sessionController.getSessionById);
router.put('/:id', protect, sessionController.updateSession);
router.delete('/:id', protect, sessionController.deleteSession);
router.post('/:id/book', protect, sessionController.bookSession);

module.exports = router;
