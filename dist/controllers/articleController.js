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
const articleRepository_1 = require("../repositories/articleRepository");
const HttpException_1 = require("../middleware/HttpException"); // Import custom error class
const articleRepository = new articleRepository_1.ArticleRepository();
// Controller to create an article
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author, text } = req.body;
        yield articleRepository.createArticle(author, text);
        res.status(201).send('Article saved successfully');
    }
    catch (error) {
        next(new HttpException_1.HttpException(500, error instanceof Error ? error.message : 'Unknown error occurred'));
    }
});
exports.createArticle = createArticle;
// Controller to get an article by ID
const getArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const article = yield articleRepository.getArticleById(articleId);
        if (!article) {
            return next(new HttpException_1.HttpException(404, 'Article not found'));
        }
        res.status(200).json(article);
    }
    catch (error) {
        next(new HttpException_1.HttpException(500, error instanceof Error ? error.message : 'Unknown error occurred'));
    }
});
exports.getArticleById = getArticleById;
// Controller to search for words in articles and calculate word offsets
const findWordsInArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = req.params.word;
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const query = { text: { $regex: regex } };
        // Call the repository to fetch articles containing the word
        const articles = yield articleRepository.getArticleByQuery(query);
        // Handle the logic to map the articles and find word offsets
        const result = articles.map(article => {
            const offsets = [];
            let match;
            const text = article.text;
            // Find all occurrences of the word and record their positions
            while ((match = regex.exec(text)) !== null) {
                offsets.push(match.index);
            }
            return {
                article_id: article._id.toString(),
                offsets: offsets
            };
        });
        res.status(200).json({ word, locations: result });
    }
    catch (error) {
        next(new HttpException_1.HttpException(500, error instanceof Error ? error.message : 'Unknown error occurred'));
    }
});
exports.findWordsInArticles = findWordsInArticles;
