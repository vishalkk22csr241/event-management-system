import { v4 as uuidv4 } from 'uuid'; // UUID for unique session ID
import bcrypt from 'bcrypt';
import { Session } from '../models/Session.model.js';
import { roles } from '../utils/roles.js';

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Validate role
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        // Find user in the corresponding model
        const Model = roles[role];
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a session ID
        const sessionId = uuidv4();

        // Save the session in the database
        await Session.create({
            sessionId,
            userId: user._id,
            role,
        });

        // Send the session ID as a secure cookie
        res.cookie('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookies in production
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.status(200).json({ message: 'Login successful.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};



export const logout = async (req, res) => {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
        return res.status(400).json({ message: 'No active session to log out.' });
    }

    try {
        // Delete the session from the database
        await Session.deleteOne({ sessionId });

        // Clear the session cookie
        res.clearCookie('session_id', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to log out.' });
    }
};
