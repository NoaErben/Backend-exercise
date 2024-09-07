import { Request, Response, NextFunction } from 'express';
import { HttpException } from './HttpException';

// Global error handling middleware
export const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Determine the status code and message
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';

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

    res.status(status).json(response);
};
