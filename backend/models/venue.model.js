import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    name: { type: String },
    incharge: { type: String },
    capacity: { type: Number },
    type: { type: String, enum: ['Seminar Hall', 'Computer Lab'] },
    department: { type: String },
    availabilityDates: [{ startDate: Date, endDate: Date }] // Used for dynamic availability checking
});






export const Venue = mongoose.model('Venue', venueSchema);
