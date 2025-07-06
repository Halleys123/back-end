import { Logger as WinstonLogger } from 'winston';

declare global {
   var logger: Logger;
}
declare module 'winston' {
   interface Logger {
      success(message: string, ...meta: unknown[]): Logger;
   }
}
export {};
