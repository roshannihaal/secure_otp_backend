import app from './app';
import { config } from './config';

const port = config.PORT;
const node_env = config.NODE_ENV;

app.listen(port, () => {
  console.log(`${node_env} app listening on port ${port}`);
});
