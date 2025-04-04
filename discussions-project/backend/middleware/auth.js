const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('Auth middleware - Session:', req.session);
    console.log('Auth middleware - User:', req.session.user);

    if (!req.session.user) {
        console.log('No user in session, returning 401');
        return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
        });
    }

    console.log('User authenticated, proceeding');
    next();
};

module.exports = authMiddleware;