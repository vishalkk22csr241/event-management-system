import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
    {
        name: { type: String },
        rollNo: { type: String, unique: true },
        email: { type: String, unique: true },
        dept: { type: String },
        password: { type: String },
        yearOfStudy: { type: Number },
        passOutYear: { type: Number },
        section: { type: String },
    },
    { timestamps: true }
);

export const Participant = mongoose.model('Participant', participantSchema);



const eventCoordinatorSchema = new mongoose.Schema(
    {
        name: { type: String },
        clubName: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
    },
    { timestamps: true }
);

export const EventCoordinator = mongoose.model('EventCoordinator', eventCoordinatorSchema);




const adminSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
    },
    { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);



