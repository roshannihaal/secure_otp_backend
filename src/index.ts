import app from './app';
import { config } from './config';

const port = config.PORT;
const node_env = config.NODE_ENV;

app.listen(port, () => {
  console.log(`App (${node_env}) listening on port ${port}`);
});
