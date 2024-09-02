import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import articleRoutes from './routes/articleRoutes';
import { logTenantId } from './middleware/logTenantId';

// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logTenantId);

// MongoDB Atlas connection URI
const uri: string = "mongodb+srv://noaerben:Noa%402801@noaserver.pg72a.mongodb.net/?retryWrites=true&w=majority&appName=noaserver";

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas', err);
        process.exit(1); // Optionally exit the process if the connection fails
    });

// Routes
app.use('/api', articleRoutes);

// Global Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('An error occurred, please try again later.');
    } else {
        res.status(500).send(`Error: ${err.message}\n${err.stack}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
