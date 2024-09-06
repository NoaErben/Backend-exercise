import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import articleRoutes from './routes/articleRoutes';
import { logTenantId } from './middleware/logTenantId';
import { connectToMongoDB } from './utils/db';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logTenantId);

// Function to start the server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // API routes
        app.use('/api', articleRoutes);

        // Health check route
        app.get('/health', (req: Request, res: Response) => {
            res.status(200).send('Service is up and running!');
        });

        // Global error handler
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (process.env.NODE_ENV === 'production') {
                res.status(500).send('An internal error occurred.');
            } else {
                res.status(500).send(`Error: ${err.message}\nStack: ${err.stack}`);
            }
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Exit if something goes wrong
    }
};

// Start the server
startServer();
