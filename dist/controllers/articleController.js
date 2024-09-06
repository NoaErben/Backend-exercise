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
const articleService_1 = require("../services/articleService");
const articleService = new articleService_1.ArticleService();
// Controller to create an article
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author, text } = req.body;
        yield articleService.createArticle(author, text);
        // Send a plain text message upon successful save
        res.status(201).send('Article saved successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(`Error: ${error.message}`);
        }
        else {
            res.status(500).send('An unexpected error occurred.');
        }
    }
});
exports.createArticle = createArticle;
// Controller to get an article by ID
const getArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const article = yield articleService.getArticleById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    }
    catch (error) {
        next(error); // Pass error to error-handling middleware
    }
});
exports.getArticleById = getArticleById;
// Controller to search for words in articles
const findWordsInArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = req.params.word;
        const result = yield articleService.searchWordInArticles(word);
        res.status(200).json(result);
    }
    catch (error) {
        next(error); // Pass error to error-handling middleware
    }
});
exports.findWordsInArticles = findWordsInArticles;
