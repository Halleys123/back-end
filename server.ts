import './utils/logger.js';
import './utils/load-env.js';
import app from './app.js';

const PORT: number | undefined = Number(process.env.SERVER_PORT) || 3000;

app.listen(PORT, () => {
   logger.success(`Listening on http://localhost:${PORT}`);
});
