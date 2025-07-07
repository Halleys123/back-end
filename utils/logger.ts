import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config({
   path: '.env',
   quiet: true,
});
// eslint-disable-next-line no-process-env
const logLevel: string | undefined = process.env.LOG_LEVEL || 'silly';

winston.addColors({
   emerg: 'bgRed white',
   error: 'orange',
   success: 'green',
   warn: 'yellow',
   info: 'cyan',
   debug: 'blue',
   verbose: 'magenta',
   silly: 'white',
});

const logger: winston.Logger = winston.createLogger({
   levels: {
      emerg: 0,
      error: 1,
      success: 2,
      warn: 3,
      info: 4,
      debug: 5,
      verbose: 6,
      silly: 7,
   },
   level: 'error',
   transports: [
      new winston.transports.Console({
         format: winston.format.combine(
            winston.format.timestamp({
               format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf((info: winston.Logform.TransformableInfo) => {
               let fileLine: string = 'unknown:0';
               const err: Error = new Error();
               if (err.stack) {
                  const stack: string[] = err.stack.split('\n');
                  const userFrame: string | undefined = stack.find(
                     (line: string) =>
                        line.includes('.js:') && !line.includes('node_modules')
                  );
                  if (userFrame) {
                     const match: RegExpMatchArray | null = userFrame.match(
                        /\(([^)]+):(\d+):(\d+)\)/
                     );
                     if (match && match[1] && match[2]) {
                        const fileName: string | undefined = match[1]
                           .split(/[\\/]/)
                           .pop();
                        fileLine = `${fileName}:${match[2]}`;
                     }
                  }
               }
               const LEVEL_WIDTH: number = 9;
               const level: string = info.level
                  .toUpperCase()
                  .padEnd(LEVEL_WIDTH, ' ');
               const timestamp: string = String(info['timestamp']);
               let levelBg: string;
               switch (info.level) {
                  case 'emerg':
                     levelBg = `\x1b[41m\x1b[97m${level}\x1b[0m`; // Red bg, bright white text
                     break;
                  case 'error':
                     levelBg = `\x1b[41m\x1b[48;2;255;127;68m${level}\x1b[0m`; // orange bg rgba(255, 127, 68, 1), white text
                     break;
                  case 'success':
                     levelBg = `\x1b[48;2;128;255;0m\x1b[30m${level}\x1b[0m`; // Charteuse bg, black text
                     break;
                  case 'warn':
                     levelBg = `\x1b[43m\x1b[30m${level}\x1b[0m`; // Yellow bg, black text
                     break;
                  case 'info':
                     levelBg = `\x1b[48;2;62;180;137m\x1b[30m${level}\x1b[0m`; // Mint bg, black text
                     break;
                  case 'debug':
                     levelBg = `\x1b[48;2;138;43;226m\x1b[30m${level}\x1b[0m`; // Blue Violet bg, black text
                     break;
                  case 'verbose':
                     levelBg = `\x1b[45m\x1b[37m${level}\x1b[0m`; // Magenta bg, white text
                     break;
                  case 'silly':
                     levelBg = `\x1b[47m\x1b[30m${level}\x1b[0m`; // White bg, black text
                     break;
                  default:
                     levelBg = `\x1b[47m\x1b[30m${level}\x1b[0m`;
               }
               const tsBg: string = `\x1b[48;2;0;127;255m\x1b[38;2;255;255;255m${timestamp}\x1b[0m`;

               // Color emerg message text as well
               return `[${levelBg}] [${tsBg}] ${fileLine} -> ${info.message}`;
            })
         ),
         level: logLevel,
      }),
      new winston.transports.File({
         filename: `logs/${new Date().toISOString().split('T')[0]}.log`,
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
         ),
      }),
   ],
});

// Add the 'success' and 'emerg' methods to the logger instance
logger.success = function (
   message: string,
   ...meta: unknown[]
): winston.Logger {
   return this.log('success', message, ...meta);
};

logger.emerg = function (
   message: string | object,
   ...meta: unknown[]
): winston.Logger {
   if (typeof message === 'object') {
      message = JSON.stringify(message, null, 2);
   }
   return this.log('emerg', message, ...meta);
};

if (!global.logger) {
   global.logger = logger;
}
export default logger;
