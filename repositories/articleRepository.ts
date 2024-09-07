import { Article } from '../models/article';
import { IArticle } from '../models/article';
import mongoose, { FilterQuery, HydratedDocument } from 'mongoose';

// Define a custom type that includes the article ID and extends IArticle
type ArticleWithId = HydratedDocument<IArticle>;

export class ArticleRepository {
    // Create a new article
    async createArticle(author: string, text: string): Promise<any> {
        try {
            const article = new Article({ author, text });
            await article.save();
        } catch (error) {
            console.error('Error creating article:', error);
            throw new Error('Database error');
        }
    }

    // Get an article by its ID
    getArticleById(id: string): Promise<IArticle | null> {
        return Article.findById(id);
    }

    // Get articles by query (for word search)
    async getArticleByQuery(query: FilterQuery<IArticle>): Promise<ArticleWithId[]> {
        try {
            return await Article.find(query).exec();
        } catch (error) {
            console.error('Error fetching articles by query:', error);
            throw new Error('Database error while fetching articles');
        }
    }
}
