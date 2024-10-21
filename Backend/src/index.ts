import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import musicRoutes from './routes/musicRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.use('/user', userRoutes);
app.use('/music', musicRoutes);
app.use('/subscriptions', subscriptionRoutes);

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});