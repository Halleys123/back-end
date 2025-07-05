import './utils/logger.js';
import app from './app.js';

app.listen(3000, () => {
   logger.info('Listening on http://localhost:3000');
});
