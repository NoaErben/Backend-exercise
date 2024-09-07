import mongoose, { Schema, Model } from 'mongoose';

const ArticleSchema = new Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
});

// Infer the type from the schema
export type IArticle = mongoose.InferSchemaType<typeof ArticleSchema>;

export const Article: Model<IArticle> = mongoose.model('Article', ArticleSchema);
