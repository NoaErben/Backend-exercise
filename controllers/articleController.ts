import { Request, Response } from 'express';
import {Article, IArticle} from '../models/article';
import mongoose, { FilterQuery } from 'mongoose';

// extends IArticle with all the properties of Document
type ArticleWithId = mongoose.HydratedDocument<IArticle>;

// Create a new article
export const createArticle = async (req: Request, res: Response) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        res.status(201).send("Article saved successfully");
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
};

// Get an article by ID
export const getArticleById = async (req: Request, res: Response) => {
    try {
        const article = await Article.findById(req.params.id) as ArticleWithId | null;
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve article', error });
    }
};

// Find words in articles
export const findWordsInArticles = async (req: Request, res: Response) => {
    try {
        const keyword = req.params.word;
        const regex = new RegExp(keyword, 'g');

        const query: FilterQuery<IArticle> = { text: { $regex: regex } };

        const articles = await Article.find(query).exec() as ArticleWithId[];

        if (!articles || !Array.isArray(articles)) {
            res.status(500).send('Unexpected error: articles is not an array');
            return;
        }

        const results = articles.map(article => {
            const offsets: number[] = [];
            let match: RegExpExecArray | null;

            // Type narrowing to ensure article.text is a string
            const text = article.text as string;

            // Find all occurrences of the word in the article's text
            while ((match = regex.exec(text)) !== null) {
                offsets.push(match.index);
            }

            return {
                article_id: article._id.toString(),
                offsets: offsets
            };
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving articles', error });
    }
};
