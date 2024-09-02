import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { IArticle, Article } from './models/article';  // Import the Article model with TypeScript
import { FilterQuery } from 'mongoose';

// MongoDB Atlas connection URI
const uri: string = "mongodb+srv://noaerben:Noa%402801@noaserver.pg72a.mongodb.net/?retryWrites=true&w=majority&appName=noaserver";

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas', err);
    });

// Initialize Express
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to create and save an article
app.post('/articles', async (req: Request, res: Response): Promise<void> => {
    const { author, text } = req.body;

    const newArticle = new Article({
        author,
        text
    });

    try {
        await newArticle.save();
        res.status(201).send('Article created successfully');
    } catch (error) {
        res.status(500).send('Error creating article');
    }
});

// Express Route to find a word in articles
app.get('/articles/search', async (req: Request, res: Response): Promise<void> => {
    const word: string | undefined = req.query.word as string;
    if (!word) {
        res.status(400).send('Word query parameter is required');
        return;
    }

    try {
        const query: FilterQuery<IArticle> = { text: { $regex: word } };

        // Perform the query with the correct type
        const articles = await Article.find(query).exec() as IArticle[];

        if (!articles || !Array.isArray(articles)) {
            res.status(500).send('Unexpected error: articles is not an array');
            return;
        }

        const results = articles.map(article => {
            const offsets: number[] = [];
            const regex = new RegExp(word, 'g'); // 'g' for global, no 'i' flag for case-sensitive
            let match: RegExpExecArray | null;

            // Find all occurrences of the word in the article's text
            while ((match = regex.exec(article.text)) !== null) {
                offsets.push(match.index);
            }

            return `{article_id: ${(article._id as mongoose.Types.ObjectId).toString()}, offsets:[${offsets.join(', ')}]}`;
        });

        const response = `{
word: "${word}",
locations:[${results.join(', ')}]
}`;
        res.send(response);
    } catch (error) {
        console.error('Error searching for word in articles:', error);
        res.status(500).send('Error searching for word in articles');
    }
});  // <-- Missing curly bracket is added here to close the route handler

// Route to get an article by ID
app.get('/articles/getById/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        // Perform the query with explicit type casting
        const article = await Article.findOne({ _id: req.params.id }) as IArticle | null;

        if (!article) {
            res.status(404).send('Article not found');
            return;
        }
        res.send(article);
    } catch (error) {
        res.status(500).send('Error retrieving article');
    }
});

// Start the server (If process.env.PORT is not set, the server will default to port 3000)
const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
