import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
