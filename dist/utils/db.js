"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const uri = process.env.MONGODB_URI || '';
    // Check if the URI is provided
    if (!uri) {
        console.error('MongoDB URI is not set in environment variables');
        process.exit(1); // Exit the process if the URI is not set
    }
    try {
        // Connect to MongoDB Atlas using Mongoose
        yield mongoose_1.default.connect(uri);
        console.log('Connected to MongoDB Atlas');
    }
    catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        process.exit(1); // Exit if connection fails
    }
});
exports.connectToMongoDB = connectToMongoDB;
