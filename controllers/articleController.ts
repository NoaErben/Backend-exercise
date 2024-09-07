import { Request, Response, NextFunction } from 'express';
import { ArticleRepository } from '../services/articleRepository';
import { FilterQuery } from 'mongoose';
import { IArticle } from '../models/article';

const articleService = new ArticleRepository();

// Controller to create an article
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, text } = req.body;
        await articleService.createArticle(author, text);

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

// Controller to search for words in articles and calculate word offsets
export const findWordsInArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const word = req.params.word;
        const regex = new RegExp(word, 'g');
        const query: FilterQuery<IArticle> = { text: { $regex: regex } };

        // Call the client to fetch articles containing the word
        const articles = await articleService.getArticleByQuery(query);

        // map the articles and find word offsets
        const result = articles.map(article => {
            const offsets: number[] = [];
            let match: RegExpExecArray | null;

            const text = article.text as string;

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
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};
