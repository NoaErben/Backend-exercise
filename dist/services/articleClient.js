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
exports.ArticleClient = void 0;
const article_1 = require("../models/article");
class ArticleClient {
    // Create a new article
    createArticle(author, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = new article_1.Article({ author, text });
                yield article.save();
            }
            catch (error) {
                console.error('Error creating article:', error);
                throw new Error('Database error');
            }
        });
    }
    // Get an article by its ID
    getArticleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return article_1.Article.findById(id);
        });
    }
    // Get articles by query (for word search)
    getArticleByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield article_1.Article.find(query).exec();
            }
            catch (error) {
                console.error('Error fetching articles by query:', error);
                throw new Error('Database error while fetching articles');
            }
        });
    }
}
exports.ArticleClient = ArticleClient;
