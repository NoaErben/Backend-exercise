// This code sets up a basic Express server that listens on port 3000
// (or any port specified in the PORT environment variable).
// It also includes a basic route (/) that returns a simple "Hello, world!" message.

// imports the Express library, which is a popular web framework for Node.js.
const express = require('express');

// imports the body-parser library, which is a middleware
// for handling incoming request bodies in a middleware chain.
// It's particularly useful for parsing JSON data sent in HTTP requests.
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Article = require('./models/article');  // Import the Article model


// initiates a connection to a MongoDB database using the Mongoose library.
//todo - change the environment to be a cloud environment
mongoose.connect('mongodb://localhost:27017/mydatabase', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

const app = express();

// Middleware to parse JSON request bodies
// Middleware functions are functions that have access to the request (req),
// response (res), and the next middleware function in the application’s request-response cycle.
app.use(bodyParser.json());


// Route to create and save an article
app.post('/articles', async (req, res) => {
    const { author, text } = req.body;
    const newArticle = new Article({
        author,
        text
    });

    try {
        await newArticle.save();
        res.status(201).send('Article created successfully');
    } catch (error) {
        res.status(500).send('Error creating article');
    }
});

// Express Route to find a word in articles
app.get('/articles/search', async (req, res) => {
    const word = req.query.word;
    if (!word) {
        return res.status(400).send('Word query parameter is required');
    }

    try {
        // Find articles where the text field contains a match for the case-insensitive word
        const articles = await Article.find({ text: { $regex: word, $options: 'i' } });

        if (!articles || !Array.isArray(articles)) {
            return res.status(500).send('Unexpected error: articles is not an array');
        }

        // Iterate over each article to find all occurrences of the word
        const results = articles.map(article => {
            const offsets = [];
            const regex = new RegExp(word, 'gi'); // Case-insensitive and global search
            let match;

            while ((match = regex.exec(article.text)) !== null) {
                offsets.push(match.index); // Store the start index of each match
            }

            return `{article_id: ${article._id.toString()}, offsets: [${offsets.join(', ')}]}`;

        });

        // Custom formatted string response
        const response = `{word: ${word}, locations: [${results.join(', ')}]}`;
        res.send(response);
    } catch (error) {
        console.error('Error searching for word in articles:', error);
        res.status(500).send('Error searching for word in articles');
    }
});

// Route to get an article by ID
app.get('/articles/getById/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.send(article);
    } catch (error) {
        res.status(500).send('Error retrieving article');
    }
});











// Basic route for testing
// The first argument is the route path ('/')
// The second argument is a callback function that is executed when the route is matched
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Test route to create and save an article
// post
app.post('/articles/test', async (req, res) => {
    const testArticle = new Article({
        author: 'Noa Erben',
        text: 'This is a test article.'
    });

    try {
        await testArticle.save();
        res.send('Test article saved successfully');
    } catch (error) {
        res.status(500).send('Error saving test article');
    }
});





// Start the server (If process.env.PORT is not set, the server will default to port 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
