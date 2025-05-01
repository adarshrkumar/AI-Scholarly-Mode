import { Sucess, Info, Warning, Alert, Error } from './ConsoleManagement'
import express, { RequestHandler } from 'express';
import { getSearchResults, getArticleData } from './springer';
import 'dotenv/config';
import { encode } from 'punycode';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect(`/search?q=${encodeURIComponent('machine learning')}`);
})

// Search endpoint
app.get('/search', (async (req, res) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }
        const results = await getSearchResults(query);
        Info('Search results received');
        res.send(results);
    } catch (error) {
        Error('Failed to fetch search results: ' + error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
}) as RequestHandler);

// Article endpoint
app.get('/article', (async (req, res) => {
    try {
        const id = req.query.id as string;
        if (!id) {
            return res.status(400).json({ error: 'Query parameter "id" is required' });
        }
        let article = await getArticleData(id);
        res.json(article);
    } catch (error) {
        Error('Failed to fetch article data: ' + error);
        res.status(500).json({ error: 'Failed to fetch article data' });
    }
}) as RequestHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 