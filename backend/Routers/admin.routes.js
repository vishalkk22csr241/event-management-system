import express from 'express';
import { Department } from '../models/department.model.js';
import { Venue } from '../models/venue.model.js';
import { create_user } from '../controllers/Admin.controllers/create-user.controller.js';
import {  get_users } from '../controllers/Admin.controllers/get-users.controller.js';
import { change_role } from '../controllers/Admin.controllers/change-role.controller.js';
import { delete_user } from '../controllers/Admin.controllers/delete-user.controller.js';
import { isAuthenticated, authorizeRole } from '../utils/isAuthenticate.js';

const router = express.Router();



// Create User
router.post('/create-user', isAuthenticated, authorizeRole('admin'), create_user);

// Get all users categorized by role
router.get('/users', isAuthenticated, authorizeRole('admin'), get_users);

// Change user role
router.put('/change-role/:id', isAuthenticated, authorizeRole('admin'), change_role);

// Delete user by role and ID
router.delete('/delete-user/:id', isAuthenticated, authorizeRole('admin'), delete_user);





// Create a new department
router.post('/create-department', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        console.log(req.body);
        const { name, duration } = req.body;

        if (!name || !duration) {
            return res.status(400).json({ message: 'Name and duration are required.' });
        }

        const department = new Department({ name, duration });
        await department.save();

        res.status(201).json({ message: 'Department created successfully.', department });
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Add a section to a department
router.post('/add-section/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { sectionName } = req.body;

        if (!sectionName) {
            return res.status(400).json({ message: 'Section name is required.' });
        }

        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }

        department.sections.push({ name: sectionName });
        await department.save();

        res.status(200).json({ message: 'Section added successfully.', department });
    } catch (error) {
        console.error('Error adding section:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Delete a department from a department
router.delete('/delete-department/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const department = await Department.findByIdAndDelete(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }


        res.status(200).json({ message: 'Section deleted successfully.', department });
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Delete a section from a department
router.delete('/delete-section/:id/:sectionId', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const { id, sectionId } = req.params;

        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }

        department.sections = department.sections.filter(
            (section) => section._id.toString() !== sectionId
        );
        await department.save();

        res.status(200).json({ message: 'Section deleted successfully.', department });
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all departments
router.get('/departments', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ departments });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});




// Add a new venue
router.post('/add-venue', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const { name, incharge, capacity, type, department } = req.body;

        const newVenue = new Venue({
            name,
            incharge,
            capacity,
            type,
            department,
        });

        await newVenue.save();
        res.status(201).json({ message: 'Venue added successfully', venue: newVenue });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add venue', error: err.message });
    }
});

// Get all venues
router.get('/venues', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const venues = await Venue.find();
        res.status(200).json({ venues });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch venues', error: err.message });
    }
});

// Delete a venue
router.delete('/delete-venue/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await Venue.findByIdAndDelete(id);
        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete venue', error: err.message });
    }
});

export default router;
