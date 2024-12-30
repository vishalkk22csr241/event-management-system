import { roles } from '../../utils/roles.js';
  
export const delete_user = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Expecting role in the request body

    try {
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const Model = roles[role];
        const user = await Model.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}