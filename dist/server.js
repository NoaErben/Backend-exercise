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
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(express_1.default.json());
app.use(logTenantId_1.logTenantId);
// start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield (0, db_1.connectToMongoDB)();
        // API routes
        app.use('/api', articleRoutes_1.default);
        // todo - check if necessary
        // Health check route
        app.get('/health', (req, res) => {
            res.status(200).send('Service is up and running!');
        });
        // todo - exception class
        // Global error handler
        app.use((err, req, res, next) => {
            if (process.env.NODE_ENV === 'production') {
                res.status(500).send('An internal error occurred.'); //todo - expand the exception explanation
            }
            else {
                res.status(500).send(`Error: ${err.message}\nStack: ${err.stack}`);
            }
        });
        // Start the server
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
