import chalk from 'chalk';

export default function getEnv(
   key: string,
   defaultValue?: string
): string | undefined {
   logger.debug(`Fetching environment variable: ${chalk.yellow(key)}`);

   if (!key || typeof key !== 'string') {
      throw new Error('Environment variable key must be a non-empty string');
   }

   // eslint-disable-next-line no-process-env
   const value: string | number | undefined = process.env[key];
   if (value === undefined) {
      logger.warn(`Environment variable ${key} is not set`);
      if (defaultValue !== undefined) {
         logger.debug(`Using default value for ${key}: ${defaultValue}`);
         return defaultValue;
      }
      logger.error(
         `Unable to retrieve environment variable: ${chalk.red(key)}`
      );
   }
   return value;
}
