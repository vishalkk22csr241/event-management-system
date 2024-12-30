import { roles } from '../../utils/roles.js';


export const get_users = async (req, res) => {
    try {
        const categorizedUsers = {};

        for (const role in roles) {
            const users = await roles[role].find({}, '-password'); // Exclude password
            categorizedUsers[role] = users.map((user) => ({ ...user._doc }));
        }

        res.status(200).json({ users: categorizedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}