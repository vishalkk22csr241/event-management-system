import { Session } from '../models/Session.model.js';

export const isAuthenticated = async (req, res, next) => {
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
        return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }
    

    try {
        // Find session in the database
        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(401).json({ message: 'Invalid session. Please log in again.' });
        }

        // Attach session data to request object for further processing
        req.sessionData = session;

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};


export const authorizeRole = (role) => async (req, res, next) => {
    const { sessionData } = req;

    if (sessionData && sessionData.role === role) {
        return next();
    }

    return res.status(403).json({ message: 'Forbidden: Access denied.' });
};
