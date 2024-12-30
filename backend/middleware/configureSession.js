import session from 'express-session';
import connectMongo from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';


export const configureSession = (app) => {
    const MongoStore = connectMongo.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    });

    app.use(
        session({
            genid: () => uuidv4(), // Generate a unique session ID
            secret: process.env.SESSION_SECRET || 'yourSecretKey',
            resave: false,
            saveUninitialized: false,
            store: MongoStore,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
        })
    );

    console.log('Session management enabled with UUID.');
};