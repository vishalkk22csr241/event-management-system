import express from 'express';
import { Event } from '../models/Event.model.js';
import { Symposium } from '../models/Symposium.model.js';
import { isAuthenticated, authorizeRole } from '../utils/isAuthenticate.js';

const router = express.Router();


router.get('/symposiums', async (req, res) => {
    try {
        const symposiums = await Symposium.find(); // Assuming you have a Symposium model
        res.json(symposiums);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching symposiums.', error });
    }
});


router.get('/symposiums/:id/events', async (req, res) => {
    try {
        const { id } = req.params;
        const events = await Event.find({ symposium: id }); // Assuming symposium ID is stored in the event
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events for symposium.', error });
    }
});


router.get('/eventbyId/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const events = await Event.findById(id); // Assuming symposium ID is stored in the event
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events for symposium.', error });
    }
});



router.get('/registered-events', isAuthenticated, authorizeRole('participant'), async (req, res) => {
    try {
        const userId = req.sessionData.userId;
        const events = await Event.find({ "registeredParticipants.participantId": userId  });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching registered events.', error });
    }
});

router.post('/event/:id/register', isAuthenticated, authorizeRole('participant'), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.sessionData.userId; // Assuming the user's ID is stored in sessionData
        const { formData } = req.body; // Assuming `formData` is an array of user-submitted field data

        // Find the event by ID
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Validate the registration period: Check if the registration is open
        const currentDate = new Date();
        if (currentDate < event.registrationStart || currentDate > event.registrationEnd) {
            return res.status(400).json({ message: 'Registration period is not open.' });
        }

        // Validate form data: Ensure all required fields are filled
        for (let field of event.registrationForm) {
            const userField = formData.find((f) => f.fieldName === field.fieldName);
            if (field.required && (!userField || !userField.value)) {
                return res.status(400).json({ message: `${field.fieldName} is required.` });
            }
        }

        // Check if the event has reached the max number of participants (if applicable)
        if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants) {
            return res.status(400).json({ message: 'This event has reached the maximum number of participants.' });
        }

        // Add the participant to the event's registeredParticipants list
        event.registeredParticipants.push({
            participantId: userId,
            participantData: formData // Store the user-submitted form data
        });

        await event.save();

        // Optionally save registration details in a separate collection if needed
        // await EventRegistration.create({ userId, eventId: id, formData });

        res.status(200).json({ message: 'Successfully registered for the event.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering for the event.' });
    }
});




export default router; // Export the router to be used in the main application
