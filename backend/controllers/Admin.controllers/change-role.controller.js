import { roles } from '../../utils/roles.js';


export const change_role = async (req, res) => {
    const { id } = req.params;
    const { newRole, currentRole } = req.body;

    try {
        if (!roles[currentRole] || !roles[newRole]) {
            return res.status(400).json({ message: 'Invalid current role or new role.' });
        }

        const currentModel = roles[currentRole];
        const user = await currentModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newModel = roles[newRole];
        const newUser = new newModel({
            ...user._doc,
            role: newRole,
        });

        await newUser.save();

        res.status(200).json({ message: 'Role updated successfully!', user: { ...newUser._doc } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}