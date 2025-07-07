import chalk from 'chalk';

export default function getEnv(
   key: string,
   defaultValue?: string
): string | undefined {
   logger.debug(`Fetching environment variable: ${chalk.yellow(key)}`);

   if (!key || typeof key !== 'string') {
      logger.emerg(
         `Server side error: Invalid environment variable key: ${key}`
      );
      logger.emerg('Exiting process due to critical error');
      process.exit(1);
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
