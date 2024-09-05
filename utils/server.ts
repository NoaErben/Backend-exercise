import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import articleRoutes from '../routes/articleRoutes';
import { logTenantId } from '../middleware/logTenantId';
import { connectToMongoDB } from './db'; // Extracted MongoDB connection logic


// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logTenantId);

connectToMongoDB();

// Routes
app.use('/api', articleRoutes);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Service is up and running!');
});

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
