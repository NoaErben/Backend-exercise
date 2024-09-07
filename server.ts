import express, {NextFunction, Request, Response} from 'express';
import { config } from 'dotenv';
import articleRoutes from './routes/articleRoutes';
import { logTenantId } from './middleware/logTenantId';
import { connectToMongoDB } from './utils/db';
import { errorMiddleware } from './middleware/errorMiddleware';
import { HttpException } from './middleware/HttpException';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logTenantId);

// Start the server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // API routes
        app.use('/api', articleRoutes);

        // Health check route using express-healthcheck
        app.use('/healthcheck', require('express-healthcheck')());

        // Handle 404 errors for unrecognized routes
        app.use((req: Request, res: Response, next: NextFunction) => {
            next(new HttpException(404, 'Route not found'));
        });

        // Global error handler
        app.use(errorMiddleware);

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Exit if something goes wrong
    }
};

// Start the server
void startServer();
