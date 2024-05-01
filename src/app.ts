import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { connectToRedis } from './utils';

const app = express();

app.use(cors());
app.use(helmet());
app.use(hpp());

app.get('/', (req, res) => {
  const resStatusCode = 200;
  return res.status(resStatusCode).json({ statusCode: resStatusCode, message: 'Hello World!' });
});

try {
  connectToRedis();
} catch (error) {
  console.log(error);
  process.exit(1);
}

export default app;
