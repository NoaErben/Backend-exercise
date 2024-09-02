const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Article = require('./models/article');  // Import the Article model

// MongoDB Atlas connection URI
const uri = "mongodb+srv://noaerben:Noa%402801@noaserver.pg72a.mongodb.net/?retryWrites=true&w=majority&appName=noaserver";

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas', err);
    });

// Initialize Express
const app = express();

// Middleware to parse JSON request bodies
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
        const articles = await Article.find({ text: { $regex: word, $options: 'i' } });

        if (!articles || !Array.isArray(articles)) {
            return res.status(500).send('Unexpected error: articles is not an array');
        }

        const results = articles.map(article => {
            const offsets = [];
            const regex = new RegExp(word, 'gi');
            let match;

            while ((match = regex.exec(article.text)) !== null) {
                offsets.push(match.index);
            }

            return `{article_id: ${article._id.toString()}, offsets: [${offsets.join(', ')}]}`;
        });

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

// Start the server (If process.env.PORT is not set, the server will default to port 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
