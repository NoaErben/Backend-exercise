"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const logTenantId_1 = require("./middleware/logTenantId");
// Load environment variables from .env file
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(logTenantId_1.logTenantId);
// MongoDB Atlas connection URI
const uri = "mongodb+srv://noaerben:Noa%402801@noaserver.pg72a.mongodb.net/?retryWrites=true&w=majority&appName=noaserver";
// Connect to MongoDB Atlas using Mongoose
mongoose_1.default.connect(uri)
    .then(() => {
    console.log('Connected to MongoDB Atlas');
})
    .catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1); // Optionally exit the process if the connection fails
});
// Routes
app.use('/api', articleRoutes_1.default);
// Global Error Handling Middleware
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('An error occurred, please try again later.');
    }
    else {
        res.status(500).send(`Error: ${err.message}\n${err.stack}`);
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
