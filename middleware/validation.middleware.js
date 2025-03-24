const validator = {
    validateSession: (req, res, next) => {
        const { mentorId, scheduledDate, skill } = req.body;
        
        if (!mentorId || !scheduledDate || !skill) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        next();
    },

    validateReview: (req, res, next) => {
        const { rating, comment } = req.body;
        
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        next();
    }
};

module.exports = validator;
