import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
    _id: mongoose.Types.ObjectId;
    author: string;
    text: string;
}

const ArticleSchema: Schema = new Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
});

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);

