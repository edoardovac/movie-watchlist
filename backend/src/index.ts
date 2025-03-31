import express from 'express';
import routes from './routes/routes';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
dotenv.config();

app.use('/', routes);

app.listen(PORT, () => {
  console.log('Listening at port 3000...');
});
