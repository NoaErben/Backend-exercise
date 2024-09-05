"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = () => {
    // MongoDB Atlas connection URI from environment variables
    const uri = process.env.MONGODB_URI || '';
    // Check if the URI is provided
    if (!uri) {
        console.error('MongoDB URI is not set in environment variables');
        process.exit(1); // Exit the process if the URI is not set
    }
    // Connect to MongoDB Atlas using Mongoose
    mongoose_1.default.connect(uri)
        .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
        .catch((err) => {
        console.error('Error connecting to MongoDB Atlas', err);
        process.exit(1); // Exit if connection fails
    });
};
exports.connectToMongoDB = connectToMongoDB;
