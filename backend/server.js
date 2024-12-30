import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB, } from './db/connectdb.js';
import { configureSession } from './middleware/configureSession.js';
import AdminRouter from './Routers/admin.routes.js';
import authRouter from './Routers/auth.routes.js'; // Import auth routes
import EventRouter from './Routers/event.routes.js'; // Import event routes
import  ParticipantRouter  from './Routers/participate.route.js';


dotenv.config();


const app = express();
const port = process.env.PORT;

// Allow credentials and specific origin
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,              // Allow cookies and credentials
};

app.use(cors(corsOptions));

// Other middlewares like bodyParser or express.json()
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())

// Connect to MongoDB
connectDB();

// Configure session middleware
configureSession(app);


app.use('/api/admin', AdminRouter);
app.use('/api/event', EventRouter);
app.use('/api/participant',ParticipantRouter)
app.use('/auth', authRouter); // Use auth routes

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
