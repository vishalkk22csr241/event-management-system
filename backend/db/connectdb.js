import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        // Retry logic (optional)
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};



