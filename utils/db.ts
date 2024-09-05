import mongoose from 'mongoose';

export const connectToMongoDB = () => {
    // MongoDB Atlas connection URI from environment variables
    const uri: string = process.env.MONGODB_URI || '';

    // Check if the URI is provided
    if (!uri) {
        console.error('MongoDB URI is not set in environment variables');
        process.exit(1); // Exit the process if the URI is not set
    }

    // Connect to MongoDB Atlas using Mongoose
    mongoose.connect(uri)
        .then(() => {
            console.log('Connected to MongoDB Atlas');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB Atlas', err);
            process.exit(1); // Exit if connection fails
        });
};
