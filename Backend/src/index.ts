import express from 'express';
import loginRoutes from './routes/loginRoutes';
import musicRoutes from './routes/musicRoutes';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/login', loginRoutes);
app.use('/music', musicRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});