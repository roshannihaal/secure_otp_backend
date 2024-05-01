import app from './app';
import { config } from './config';

const port = config.PORT;
const nodeEnv = config.NODE_ENV;

app.listen(port, () => {
  console.log(`App (${nodeEnv}) listening on port ${port}`);
});
