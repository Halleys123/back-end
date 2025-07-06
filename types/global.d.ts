import { Logger as WinstonLogger } from 'winston';

declare global {
   var logger: Logger;

   interface envSettingsFileType {
      filename: string;
      description: string;
   }
   interface envSettings {
      useSecretsEnv: boolean;
      useSeparateSecretFiles: boolean;
      fileTypes: envSettingsFileType[];
   }
}
declare module 'winston' {
   interface Logger {
      success(message: string, ...meta: unknown[]): Logger;
   }
}
export {};
