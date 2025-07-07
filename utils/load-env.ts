import { config } from 'dotenv';
import getEnv from './get-env.ts';

const suppressEnvLogs: boolean = true;

(() => {
   try {
      logger.info('Loading environment variables...');
      config({ path: '.env', quiet: suppressEnvLogs });

      // Load secrets.env
      config({ path: 'secrets.env', quiet: suppressEnvLogs });

      const nodeEnv: string | undefined = getEnv('NODE_ENV');
      logger.silly('NODE_ENV:', nodeEnv);
      if (nodeEnv) {
         logger.debug(
            'Unable to find NODE_ENV variable, using default .env file'
         );
         config({ path: `.${nodeEnv}.env`, quiet: suppressEnvLogs });
      }

      // eslint-disable-next-line no-process-env
      logger.success('Environment variables loaded:', process.env);
   } catch (error) {
      logger.error('Error loading environment variables:', error);
   }
})();
