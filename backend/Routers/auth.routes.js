import express from 'express';
import { login, logout } from '../controllers/login.controller.js';
import { isAuthenticated } from '../utils/isAuthenticate.js';

const router = express.Router();

// Login Route
router.post('/login', login);

router.post('/logout', logout);

// Backend route to fetch user role
router.get('/get-role', isAuthenticated, (req, res) => {
   
    if (!req.sessionData) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role } = req.sessionData; // Assuming the user's role is stored in session
    res.status(200).json({ role });
});


// Example Protected Route
router.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You are authenticated!' });
});

export default router;
