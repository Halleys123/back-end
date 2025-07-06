import { config } from 'dotenv';

(() => {
   try {
      logger.info('Loading environment variables...');
      config({ path: '.env' });

      const nodeEnv: string | undefined = process.env.NODE_ENV;
      logger.silly('NODE_ENV:', nodeEnv);
      if (nodeEnv) {
         logger.debug(
            'Unable to find NODE_ENV variable, using default .env file'
         );
         config({ path: `.${nodeEnv}.env` });
      }

      logger.success('Environment variables loaded:', process.env);
   } catch (error) {
      logger.error('Error loading environment variables:', error);
      throw error; // Re-throw the error to stop the application if env loading fails
   }
})();
