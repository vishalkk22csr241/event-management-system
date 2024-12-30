import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    symposium: { type: mongoose.Schema.Types.ObjectId, ref: 'Symposium' },
    name: { type: String },
    description: { type: String },
    type: { type: String, enum: ['technical', 'non_technical'] },
    competitionType: { type: String, enum: ['solo', 'team'] },
    poster: { type: String }, // URL or file path for the poster
    registrationForm: [{ fieldName: String, fieldType: String, required: Boolean }], // Custom form fields
    eligibilityCriteria: { type: String },
    registrationStart: { type: Date },
    registrationEnd: { type: Date },
    maxParticipants: { type: Number },
    registeredParticipants: [
        {
            participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
            participantData: mongoose.Schema.Types.Mixed // Custom data based on registrationForm
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Event Coordinator
});

export const Event = mongoose.model('Event', EventSchema);
