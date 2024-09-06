import mongoose, { Schema, Model } from 'mongoose';

// Define the schema without manual typing
const ArticleSchema = new Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
});

// Infer the type from the schema automatically
export type IArticle = mongoose.InferSchemaType<typeof ArticleSchema>;

// Correctly typing the Model without passing a type argument to mongoose.model
export const Article: Model<IArticle> = mongoose.model('Article', ArticleSchema);
