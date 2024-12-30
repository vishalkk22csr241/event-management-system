import mongoose from "mongoose";

const SymposiumSchema = new mongoose.Schema({
    name: { type: String},
    description: { type: String },
    type: { type: String, enum: ['inter_departmental', 'inter_college', 'intra_college']},
    startDate: { type: Date},
    endDate: { type: Date},
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Technical and Non-Technical Events
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue'}, // Venue for the symposium
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} // Event Coordinator
});

export const Symposium = mongoose.model('Symposium', SymposiumSchema);
