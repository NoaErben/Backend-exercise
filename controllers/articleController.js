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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWordsInArticles = exports.getArticleById = exports.createArticle = void 0;
const article_1 = require("../models/article");
// Create a new article
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newArticle = new article_1.Article(req.body);
        yield newArticle.save();
        res.status(201).send("article saved successfully");
    }
    catch (error) {
        res.send(`error: ${error}`);
    }
});
exports.createArticle = createArticle;
// Get an article by IDß
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield article_1.Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve article', error });
    }
});
exports.getArticleById = getArticleById;
// Find words in articles
const findWordsInArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.params.word;
        const regex = new RegExp(keyword, 'g');
        const query = { text: { $regex: regex } };
        // Perform the query with the correct type
        const articles = yield article_1.Article.find(query).exec();
        if (!articles || !Array.isArray(articles)) {
            res.status(500).send('Unexpected error: articles is not an array');
            return;
        }
        const results = articles.map(article => {
            const offsets = [];
            let match;
            // Find all occurrences of the word in the article's text
            while ((match = regex.exec(article.text)) !== null) {
                offsets.push(match.index);
            }
            // return `{article_id: ${(article._id as mongoose.Types.ObjectId).toString()}, offsets:[${offsets.join(', ')}]}`;
            // Return a JSON object
            return {
                article_id: article._id.toString(),
                offsets: offsets
            };
        });
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving articles', error });
    }
});
exports.findWordsInArticles = findWordsInArticles;
