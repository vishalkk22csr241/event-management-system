import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema(
    {
        sessionId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: '1d' }, // Automatically delete expired sessions
    },
    { timestamps: true }
);


export const Session = mongoose.model('Session', SessionSchema);