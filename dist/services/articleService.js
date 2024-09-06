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
exports.ArticleService = void 0;
const article_1 = require("../models/article");
class ArticleService {
    // Create a new article (returns void)
    createArticle(author, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = new article_1.Article({ author, text });
            yield article.save(); // No need to return the article
        });
    }
    // Get an article by its ID
    getArticleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield article_1.Article.findById(id);
        });
    }
    // Search for a word in articles and return word offsets
    searchWordInArticles(word) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(word, 'g');
            const query = { text: { $regex: regex } };
            try {
                const articles = yield article_1.Article.find(query).exec();
                const result = articles.map(article => {
                    const offsets = [];
                    let match;
                    const text = article.text;
                    while ((match = regex.exec(text)) !== null) {
                        offsets.push(match.index);
                    }
                    return {
                        article_id: article._id.toString(),
                        offsets: offsets
                    };
                });
                return { word, locations: result };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error retrieving articles: ${error.message}`);
                }
                else {
                    throw new Error('An unexpected error occurred while retrieving articles');
                }
            }
        });
    }
}
exports.ArticleService = ArticleService;
