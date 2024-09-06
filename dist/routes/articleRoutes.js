"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleController_1 = require("../controllers/articleController");
const router = express_1.default.Router();
// POST route for creating a new article
router.post('/articles', articleController_1.createArticle);
// GET route for getting an article by ID
router.get('/getById/:id', articleController_1.getArticleById);
// GET route for searching articles by a word in the text
router.get('/getByWord/:word', articleController_1.findWordsInArticles);
exports.default = router;
