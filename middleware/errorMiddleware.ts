import { Request, Response, NextFunction } from 'express';
import { HttpException } from './HttpException'; // Replace with actual path

// Global error handling middleware
export const errorMiddleware = (
    error: HttpException,      // The error object passed to middleware
    req: Request,              // Express Request object
    res: Response,             // Express Response object
    next: NextFunction         // Express Next function (not used but required)
) => {
    // Determine the status code and message
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';

    // Log the error for debugging (can be integrated with external logging)
    console.error(`ERROR ${status}: ${message}`);

    // Create a response object
    const response: { status: number; message: string; stack?: string } = {
        status,
        message
    };

    // If in development mode, include the stack trace for debugging
    if (process.env.NODE_ENV !== 'production') {
        response.stack = error.stack;
    }

    // If in production mode and status is 500, hide detailed message
    if (process.env.NODE_ENV === 'production' && status === 500) {
        response.message = 'An internal error occurred.';
    }

    // Send the error response to the client
    res.status(status).json(response);
};
