import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

const requiredExtensions: Array<string> = JSON.parse(
   fs.readFileSync('.vscode/extensions.js', 'utf-8')
).recommendations;

const HOME: string | undefined = process.env['HOME'];
const USERPROFILE: string | undefined = process.env['USERPROFILE'];

if (!HOME || !USERPROFILE) {
   const filePath: string = __filename;
   const fileName: string = path.basename(filePath);
   console.log(
      chalk.bgRed('ERROR'),
      chalk.grey(`File: ${fileName}`),
      'Either Home or Userprofile environement variable not set'
   );
   process.exit(1);
}

const extensionsDir: string = path.join(
   HOME || USERPROFILE,
   '.vscode',
   'extensions'
);

let missing: Array<string> = [];

requiredExtensions.forEach((ext: string) => {
   if (
      !fs.readdirSync(extensionsDir).some((dir: string) => dir.startsWith(ext))
   ) {
      missing.push(ext);
   }
});

if (missing.length > 0) {
   console.error(
      '❌ Required VS Code extensions are missing:\n',
      missing.join('\n')
   );
   process.exit(1);
} else {
   console.log('✅ All required VS Code extensions are installed.');
}
