import express from 'express';
import {getArticleById, createArticle, findWordsInArticles} from '../controllers/articleController';

const router = express.Router();

// POST route for creating a new article
router.post('/articles', createArticle);

// GET route for getting an article by ID
router.get('/getById/:id', getArticleById);

router.get('/getByWord/:word', findWordsInArticles)

export default router;
