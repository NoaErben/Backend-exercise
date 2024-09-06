import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/articleService';

const articleService = new ArticleService();

// Controller to create an article
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, text } = req.body;
        await articleService.createArticle(author, text);

        // Send a plain text message upon successful save
        res.status(201).send('Article saved successfully');
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(`Error: ${error.message}`);
        } else {
            res.status(500).send('An unexpected error occurred.');
        }
    }
};

// Controller to get an article by ID
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleId = req.params.id;
        const article = await articleService.getArticleById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};

// Controller to search for words in articles
export const findWordsInArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const word = req.params.word;
        const result = await articleService.searchWordInArticles(word);
        res.status(200).json(result);
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};
