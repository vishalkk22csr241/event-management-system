import express from 'express';
import multer from 'multer';
import { Symposium } from '../models/Symposium.model.js';
import { Event } from '../models/Event.model.js';
import { Venue } from '../models/venue.model.js';
import {  isAuthenticated, authorizeRole } from '../utils/isAuthenticate.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Adjust path as needed
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });
// Create Symposium
router.post("/symposiums",  isAuthenticated, authorizeRole('event_coordinator'), async (req, res) => {
    try {
        const { name, description, type, startDate, endDate, venue } = req.body;

        const symposium = new Symposium({
            name,
            description,
            type,
            startDate,
            endDate,
            venue,
            createdBy: req.sessionData.userId,
        });

        await symposium.save();
        res.status(201).json({ message: "Symposium created successfully!", symposium });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating symposium.", error });
    }
});

// Edit Symposium
router.put("/symposiums/:id",  isAuthenticated, authorizeRole('event_coordinator'), async (req, res) => {
    try {
        const { id } = req.params;
        const symposium = await Symposium.findById(id);

        if (!symposium) return res.status(404).json({ message: "Symposium not found." });
        if (symposium.createdBy.toString() !== req.sessionData.userId.toString())
            return res.status(403).json({ message: "You cannot edit this symposium." });

        Object.assign(symposium, req.body);
        await symposium.save();
        res.json({ message: "Symposium updated successfully.", symposium });
    } catch (error) {
        res.status(500).json({ message: "Error updating symposium.", error });
    }
});

router.delete("/symposiums/:id", isAuthenticated, authorizeRole("event_coordinator"), async (req, res) => {
    try {
        const { id } = req.params;
        const symposium = await Symposium.findById(id);

        if (!symposium) {
            return res.status(404).json({ message: "Symposium not found." });
        }

        // Ensure the logged-in user is authorized to delete this symposium
        if (symposium.createdBy.toString() !== req.sessionData.userId.toString()) {
            return res.status(403).json({ message: "You cannot delete this symposium." });
        }

        // Delete the symposium
        await Symposium.findByIdAndDelete(id);
        res.json({ message: "Symposium deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting symposium.", error });
    }
});


router.get("/symposiumsbyid/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the symposium by ID
        const symposium = await Symposium.findById(id); // Assuming `events` is a reference in the schema

        if (!symposium) {
            return res.status(404).json({ message: "Symposium not found." });
        }

        res.json({ symposium });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching symposium.", error });
    }
});


// Add Event to Symposium
router.post("/symposiums/:symposiumId/events",  isAuthenticated, authorizeRole('event_coordinator'),    upload.none(),async (req, res) => {
    try {
        const { symposiumId } = req.params;
        const symposium = await Symposium.findById(symposiumId);

        if (!symposium) return res.status(404).json({ message: "Symposium not found." });
        if (symposium.createdBy.toString() !== req.sessionData.userId.toString())
            return res.status(403).json({ message: "You cannot add events to this symposium." });
console.log(req.body);
        if (req.body.registrationForm) {
               req.body.registrationForm = JSON.parse(req.body.registrationForm);
        }



        const {
            name,
            description,
            type,
            competitionType,
            poster,
            registrationForm,
            eligibilityCriteria,
            registrationStart,
            registrationEnd,
            maxParticipants,
        } = req.body;

        const event = new Event({
            symposium: symposiumId,
            name,
            description,
            type,
            competitionType,
            poster,
            registrationForm,
            eligibilityCriteria,
            registrationStart,
            registrationEnd,
            maxParticipants,
            createdBy: req.sessionData.userId,
        });

        await event.save();
        symposium.events.push(event._id);
        await symposium.save();

        res.status(201).json({ message: "Event created successfully!", event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding event.", error });
    }
});







// Fetch all venues
router.get("/venues", async (req, res) => {
    try {
        const venues = await Venue.find({});
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: "Error fetching venues.", error });
    }
});

// Fetch available venues for a specific date range
router.post("/venues/available", async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        // Fetch venues not booked during the provided date range
        const bookedVenues = await Symposium.find({
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) },
                },
            ],
        }).select("venue");

        const bookedVenueIds = bookedVenues.map((symposium) => symposium.venue);

        const availableVenues = await Venue.find({ _id: { $nin: bookedVenueIds } });
        res.json(availableVenues);
    } catch (error) {
        res.status(500).json({ message: "Error fetching available venues.", error });
    }
});



// Fetch symposiums created by the current user
router.get("/symposiums/manage", isAuthenticated, authorizeRole('event_coordinator'), async (req, res) => {
    try {
        const userId = req.sessionData.userId; // Assuming `authenticate` middleware adds the user to `req`
        const symposiums = await Symposium.find({ createdBy: userId }).populate("events");
        res.json(symposiums);
    } catch (error) {
        res.status(500).json({ message: "Error fetching symposiums.", error });
    }
});





// View All Events in a Symposium
router.get("/symposiums/:symposiumId/events", isAuthenticated, async (req, res) => {
    try {
        const { symposiumId } = req.params;
        const events = await Event.find({ symposium: symposiumId });
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events.", error });
    }
});

// View Single Event by ID
router.get("/events/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Event not found." });
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event.", error });
    }
});

// Edit Event
router.put("/events/:id", isAuthenticated, authorizeRole('event_coordinator'),upload.none(), async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) return res.status(404).json({ message: "Event not found." });
        if (event.createdBy.toString() !== req.sessionData.userId.toString())
            return res.status(403).json({ message: "You cannot edit this event." });
        if (req.body.registrationForm) {
            req.body.registrationForm = JSON.parse(req.body.registrationForm);
     }
     const {
        name,
        description,
        type,
        competitionType,
        poster,
        registrationForm,
        eligibilityCriteria,
        registrationStart,
        registrationEnd,
        maxParticipants,
    } = req.body;

    const newevent={
        name,
        description,
        type,
        competitionType,
        poster,
        registrationForm,
        eligibilityCriteria,
        registrationStart,
        registrationEnd,
        maxParticipants,
    };



        Object.assign(event, newevent);
        await event.save();

        res.json({ message: "Event updated successfully.", event });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Failed to update event.", error });
    }
});

// Delete Event
router.delete("/events/:id", isAuthenticated, authorizeRole('event_coordinator'), async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) return res.status(404).json({ message: "Event not found." });
        if (event.createdBy.toString() !== req.sessionData.userId.toString())
            return res.status(403).json({ message: "You cannot delete this event." });

        await Event.findByIdAndDelete(id);
        res.json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Failed to delete event.", error });
    }
});



// Get participants of an event
router.get('/:id/participants', async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).populate('registrationForm','registeredParticipants.participantId');
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        const registrationForm= event.registrationForm;

        const participants = event.registeredParticipants.map((participant) => ({
            participantData: participant.participantData,
        }));

        res.status(200).json({ registrationForm,participants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching participants.' });
    }
});


export default router;
