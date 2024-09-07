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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const logTenantId_1 = require("./middleware/logTenantId");
const db_1 = require("./utils/db");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const HttpException_1 = require("./middleware/HttpException");
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(logTenantId_1.logTenantId);
// Start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield (0, db_1.connectToMongoDB)();
        // API routes
        app.use('/api', articleRoutes_1.default);
        // Health check route using express-healthcheck
        app.use('/healthcheck', require('express-healthcheck')());
        // Handle 404 errors for unrecognized routes
        app.use((req, res, next) => {
            next(new HttpException_1.HttpException(404, 'Route not found'));
        });
        // Global error handler
        app.use(errorMiddleware_1.errorMiddleware);
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Exit if something goes wrong
    }
});
// Start the server
void startServer();
