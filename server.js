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
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const article_1 = require("./models/article"); // Import the Article model with TypeScript
// MongoDB Atlas connection URI
const uri = "mongodb+srv://noaerben:Noa%402801@noaserver.pg72a.mongodb.net/?retryWrites=true&w=majority&appName=noaserver";
// Connect to MongoDB Atlas using Mongoose
mongoose_1.default.connect(uri)
    .then(() => {
    console.log('Connected to MongoDB Atlas');
})
    .catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
});
// Initialize Express
const app = (0, express_1.default)();
// Middleware to parse JSON request bodies
app.use(body_parser_1.default.json());
// Route to create and save an article
app.post('/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author, text } = req.body;
    const newArticle = new article_1.Article({
        author,
        text
    });
    try {
        yield newArticle.save();
        res.status(201).send('Article created successfully');
    }
    catch (error) {
        res.status(500).send('Error creating article');
    }
}));
// Express Route to find a word in articles
app.get('/articles/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const word = req.query.word;
    if (!word) {
        res.status(400).send('Word query parameter is required');
        return;
    }
    try {
        const query = { text: { $regex: word } };
        // Perform the query with the correct type
        const articles = yield article_1.Article.find(query).exec();
        if (!articles || !Array.isArray(articles)) {
            res.status(500).send('Unexpected error: articles is not an array');
            return;
        }
        const results = articles.map(article => {
            const offsets = [];
            const regex = new RegExp(word, 'g'); // 'g' for global, no 'i' flag for case-sensitive
            let match;
            // Find all occurrences of the word in the article's text
            while ((match = regex.exec(article.text)) !== null) {
                offsets.push(match.index);
            }
            return `{article_id: ${article._id.toString()}, offsets:[${offsets.join(', ')}]}`;
        });
        const response = `{
word: "${word}",
locations:[${results.join(', ')}]
}`;
        res.send(response);
    }
    catch (error) {
        console.error('Error searching for word in articles:', error);
        res.status(500).send('Error searching for word in articles');
    }
})); // <-- Missing curly bracket is added here to close the route handler
// Route to get an article by ID
app.get('/articles/getById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Perform the query with explicit type casting
        const article = yield article_1.Article.findOne({ _id: req.params.id });
        if (!article) {
            res.status(404).send('Article not found');
            return;
        }
        res.send(article);
    }
    catch (error) {
        res.status(500).send('Error retrieving article');
    }
}));
// Start the server (If process.env.PORT is not set, the server will default to port 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
