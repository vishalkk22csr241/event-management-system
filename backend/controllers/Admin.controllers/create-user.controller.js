import bcrypt from 'bcrypt';
import { roles } from '../../utils/roles.js';
export const create_user = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        rollNo,
        dept,
        yearOfStudy,
        passOutYear,
        section,
        clubName,
        venueName,
    } = req.body;

    // Validate common fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    try {
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const Model = roles[role];
        const existingUser = await Model.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUserData = { name, email, password: hashedPassword };

        // Role-specific fields
        if (role === 'participant') {
            if (!rollNo || !dept || !yearOfStudy || !passOutYear || !section) {
                return res.status(400).json({ message: 'All participant fields are required.' });
            }
            newUserData = { ...newUserData, rollNo, dept, yearOfStudy, passOutYear, section };
        } else if (role === 'event_coordinator') {
            if (!clubName) {
                return res.status(400).json({ message: 'Club name is required for event coordinator.' });
            }
            newUserData = { ...newUserData, clubName };
        } else if (role === 'venue_incharge') {
            if (!dept || !venueName) {
                return res.status(400).json({ message: 'Department and venue name are required for venue in-charge.' });
            }
            newUserData = { ...newUserData, dept, venueName };
        }

        const newUser = new Model(newUserData);
        await newUser.save();

        res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};