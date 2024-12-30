import mongoose from 'mongoose';


const sectionSchema = new mongoose.Schema({
    name: { type: String },
});

const departmentSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    duration: { type: Number }, // Course duration in years
    sections: [sectionSchema], // Array of sections within the department
});

export const Department = mongoose.model('Department', departmentSchema);
