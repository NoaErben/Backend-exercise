import { Article } from '../models/article';
import { IArticle } from '../models/article';
import mongoose, { FilterQuery, HydratedDocument } from 'mongoose';

// Define a custom type that includes the article ID and extends IArticle
type ArticleWithId = HydratedDocument<IArticle>;

export class ArticleService {
    // Create a new article (returns void)
    async createArticle(author: string, text: string): Promise<void> {
        const article = new Article({ author, text });
        await article.save(); // No need to return the article
    }

    // Get an article by its ID
    async getArticleById(id: string): Promise<IArticle | null> {
        return await Article.findById(id);
    }

    // Search for a word in articles and return word offsets
    async searchWordInArticles(word: string): Promise<any> {
        const regex = new RegExp(word, 'g');
        const query: FilterQuery<IArticle> = { text: { $regex: regex } };

        try {
            const articles: ArticleWithId[] = await Article.find(query).exec();

            const result = articles.map(article => {
                const offsets: number[] = [];
                let match: RegExpExecArray | null;

                const text = article.text as string;

                while ((match = regex.exec(text)) !== null) {
                    offsets.push(match.index);
                }

                return {
                    article_id: article._id.toString(),
                    offsets: offsets
                };
            });

            return { word, locations: result };

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error retrieving articles: ${error.message}`);
            } else {
                throw new Error('An unexpected error occurred while retrieving articles');
            }
        }
    }
}
