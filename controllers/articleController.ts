import { Request, Response, NextFunction } from 'express';
import { ArticleRepository } from '../repositories/articleRepository';
import { HttpException } from '../middleware/HttpException';
import { FilterQuery } from 'mongoose';
import { IArticle } from '../models/article';

const articleRepository = new ArticleRepository();

// Controller to create an article
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, text } = req.body;
        await articleRepository.createArticle(author, text);
        res.status(201).send('Article saved successfully');
    } catch (error) {
        next(new HttpException(500, error instanceof Error ? error.message : 'Unknown error occurred'));
    }
};

// Controller to get an article by ID
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleId = req.params.id;
        const article = await articleRepository.getArticleById(articleId);
        if (!article) {
            return next(new HttpException(404, 'Article not found'));
        }
        res.status(200).json(article);
    } catch (error) {
        next(new HttpException(500, error instanceof Error ? error.message : 'Unknown error occurred'));
    }
};

// Controller to search for words in articles and calculate word offsets
export const findWordsInArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const word = req.params.word;
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const query: FilterQuery<IArticle> = { text: { $regex: regex } };
        const articles = await articleRepository.getArticleByQuery(query);

        // Handle the logic to map the articles and find word offsets
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
        next(new HttpException(500, error instanceof Error ? error.message : 'Unknown error occurred'));
    }
};
