import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface envVariable {
   name: string;
   comment: string;
   sameLine: boolean;
   sampleValue?: string;
}

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const environmentFilePath: string = process.argv[2];
const overwrite: boolean = process.argv[3] == 'true' ? true : false;
const useSampleValue: boolean = process.argv[4] == 'true' ? true : false;

const pathListEnvVariables: string = path.join(
   __dirname,
   '..',
   'data',
   'environment.json'
);
const pathListSecretVariables: string = path.join(
   __dirname,
   '..',
   'data',
   'secrets.json'
);

if (!environmentFilePath || !fs.existsSync(environmentFilePath)) {
   console.log(
      chalk.bgRed.white('ERROR:'),
      chalk.magenta(
         'Invalid path provided, Please give path where .env and secret.env should be created'
      )
   );
   process.exit(-1);
}

if (
   !fs.existsSync(pathListEnvVariables) ||
   !fs.existsSync(pathListSecretVariables)
) {
   console.log(
      chalk.bgRed.white('ERROR:'),
      chalk.red(
         `Environment variables data files not found at ${pathListEnvVariables} or ${pathListSecretVariables}`
      )
   );
   process.exit(-1);
}

const envVars: envVariable[] = JSON.parse(
   fs.readFileSync(
      path.join(__dirname, '..', 'data', 'environment.json'),
      'utf-8'
   )
);
const secretVars: envVariable[] = JSON.parse(
   fs.readFileSync(path.join(__dirname, '..', 'data', 'secrets.json'), 'utf-8')
);

function generateFileContent(variables: envVariable[]): string {
   const content: string = variables.reduce(function (
      prev: string,
      cur: envVariable
   ) {
      let content: string = '';
      if (cur.sameLine) {
         content = `${cur.name}=${useSampleValue ? cur.sampleValue : ''}  #${
            cur.comment
         }\n`;
      } else {
         content = `\n# ${cur.comment}\n${cur.name}=${
            useSampleValue ? cur.sampleValue : ''
         }\n`;
      }
      return prev + content;
   }, '');
   return content;
}
async function writeFile(
   filePath: string,
   fileContent: string,
   overWrite: boolean = false
) {
   const fileExists: boolean = fs.existsSync(filePath);

   if (!overWrite && fileExists) {
      console.log(
         chalk.bgYellow.black('WARNING:'),
         chalk.yellow(`${filePath} already exists. File was not overwritten.`)
      );
      return;
   } else if (overWrite && fileExists) {
      console.log(
         chalk.bgYellowBright.black('WARNING'),
         chalk.magenta(`${filePath} will be overwritten`)
      );
   }

   fs.writeFile(filePath, fileContent, (err: NodeJS.ErrnoException | null) => {
      if (err) {
         console.log(
            chalk.bgRed.white('ERROR:'),
            chalk.red('Unable to create env file')
         );
         process.exit(-1);
      }

      console.log(
         chalk.white.bgGreen('SUCCESS: '),
         chalk.green(`${filePath} File was created successfully`)
      );
      console.log(
         chalk.black.bgYellow('MESSAGE: '),
         chalk.cyan(`Please fill ${filePath} variables in the file`)
      );
   });
}

const envFileContent: string = generateFileContent(envVars);
const secretEnvContent: string = generateFileContent(secretVars);

writeFile(environmentFilePath + '.env', envFileContent, overwrite);
writeFile(environmentFilePath + 'secret.env', secretEnvContent, overwrite);
