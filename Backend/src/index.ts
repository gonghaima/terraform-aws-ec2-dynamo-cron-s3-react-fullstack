import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/userRoutes';
import musicRoutes from './routes/musicRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/user', userRoutes);
app.use('/music', musicRoutes);
app.use('/subscriptions', subscriptionRoutes);

// Serve the index.html file for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});