import './utils/logger.js';
import app from './app.js';

const PORT: number | undefined = Number(process.env.SERVER_PORT) || 3000;

app.listen(PORT, () => {
   logger.info(`Listening on http://localhost:${PORT}`);
});
