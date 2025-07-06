import './utils/logger.js';
import './utils/load-env.js';
import chalk from 'chalk';
import getEnv from './utils/get-env.js';
import app from './app.js';

const SERVER_PORT: number | string | undefined = getEnv('SERVER_PORT');

if (!SERVER_PORT) {
   logger.error(
      chalk.red(
         'Error: SERVER_PORT environment variable is not set.\nExiting...'
      )
   );
   process.exit(1);
}

app.listen(SERVER_PORT, () => {
   logger.success(
      `Listening on ${chalk.blue(`http://localhost:${SERVER_PORT}`)}`
   );
});
