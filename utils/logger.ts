import winston from 'winston';

let logger: winston.Logger = winston.createLogger({
   levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      verbose: 4,
      silly: 5,
   },
   transports: [
      // Console output should be in following format:
      // [level] [timestamp] [file]:[line] -> [message]
      // level, timestamp should have background hightlight
      new winston.transports.Console({
         format: winston.format.combine(
            winston.format.timestamp({
               format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf((info: winston.Logform.TransformableInfo) => {
               // Get file:line from stack trace (user code, not logger)
               let fileLine: string = 'unknown:0';
               const err: Error = new Error();
               if (err.stack) {
                  const stack: string[] = err.stack.split('\n');
                  // Find the first stack frame that does not include node_modules
                  const userFrame: string | undefined = stack.find(
                     (line: string) =>
                        line.includes('.js:') && !line.includes('node_modules')
                  );
                  if (userFrame) {
                     // Extract file path and line number
                     const match: RegExpMatchArray | null = userFrame.match(
                        /\(([^)]+):(\d+):(\d+)\)/
                     );
                     if (match && match[1] && match[2]) {
                        // Get last path segment (file name)
                        const fileName: string | undefined = match[1]
                           .split(/[\\/]/)
                           .pop();
                        fileLine = `${fileName}:${match[2]}`;
                     }
                  }
               }
               // Pad level to fixed width for consistent background
               const LEVEL_WIDTH: number = 7;
               const level: string = info.level
                  .toUpperCase()
                  .padEnd(LEVEL_WIDTH, ' ');
               const timestamp: string = String(info['timestamp']);
               // ANSI background colors: 41=red, 42=green, 43=yellow, 44=blue, 45=magenta, 46=cyan, 47=white
               // Remove color for fileLine, only color level/timestamp if desired
               // Set background color based on log level
               let levelBg: string;
               switch (info.level) {
                  case 'error':
                     levelBg = `\x1b[41m\x1b[37m${level}\x1b[0m`; // Red bg, white text
                     break;
                  case 'warn':
                     levelBg = `\x1b[43m\x1b[30m${level}\x1b[0m`; // Yellow bg, black text
                     break;
                  case 'info':
                     levelBg = `\x1b[42m\x1b[30m${level}\x1b[0m`; // Green bg, black text
                     break;
                  case 'debug':
                     levelBg = `\x1b[46m\x1b[30m${level}\x1b[0m`; // Cyan bg, black text
                     break;
                  case 'verbose':
                     levelBg = `\x1b[45m\x1b[37m${level}\x1b[0m`; // Magenta bg, white text
                     break;
                  case 'silly':
                     levelBg = `\x1b[47m\x1b[30m${level}\x1b[0m`; // White bg, black text
                     break;
                  default:
                     levelBg = `\x1b[47m\x1b[30m${level}\x1b[0m`; // Default: white bg, black text
               }
               const tsBg: string = `\x1b[44m\x1b[37m${timestamp}\x1b[0m`;
               return `[${levelBg}] [${tsBg}] ${fileLine} -> ${info.message}`;
            })
         ),
         level: 'debug', // Set to 'debug' to capture all levels
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
if (!global.logger) {
   global.logger = logger;
}
export default logger;
