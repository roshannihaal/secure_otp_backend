import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';

const app = express();

app.use(cors());
app.use(helmet());
app.use(hpp());

app.get('/', (req, res) => {
  const resStatusCode = 200;
  return res.status(resStatusCode).json({ statusCode: resStatusCode, message: 'Hello World!' });
});

export default app;
