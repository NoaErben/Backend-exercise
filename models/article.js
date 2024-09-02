// This code defines a basic Article schema with two fields:
// 1. author: A string that is required and stores the author's name.
// 2. text: A string that is required and stores the content of the article.


const mongoose = require('mongoose');

// Define the schema for an Article
const articleSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: { type: String, required: true }
});

// Create the Article model from the schema
// This line creates a Mongoose model named Article using the articleSchema defined earlier.
const Article = mongoose.model('Article', articleSchema);

// This line exports the Article model so it can be used in other parts of the application
module.exports = Article;
