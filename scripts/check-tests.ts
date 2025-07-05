import fs from 'fs';
import path from 'path';
import url from 'url';
import chalk from 'chalk';

const __dirname: string = url.fileURLToPath(new URL('.', import.meta.url));

const rootDir: string = path.join(__dirname, '..');

const buildDir: string = path.join(rootDir, 'dist');
const testsDir: string = path.join(rootDir, 'tests');

function walk(dir: string): string[] {
   return fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((ent: fs.Dirent) => {
         const full: string = path.join(dir, ent.name);
         return ent.isDirectory() ? walk(full) : [full];
      });
}

// Recursively get file names in build directory and subdirectories
// now save file names available in build directory with a value of false
const buildFiles: string[] = walk(buildDir).filter(
   (f: string) => f.endsWith('.js') && !f.endsWith('.test.js')
);

const buildFileMap: Record<string, boolean> = Object.fromEntries(
   buildFiles.map((f: string) => [f, false])
);

// Get all test files in tests directory and subdirectories
const testFiles: string[] = walk(testsDir).filter((f: string) =>
   f.endsWith('.test.js')
);
// Create a map of test files
const testFileMap: Record<string, boolean> = Object.fromEntries(
   testFiles.map((f: string) => [f, true])
);

// Check if each file in build directory has a corresponding test file
const missingTests: { file: string; test: string }[] = [];
const missingFiles: { file: string; test: string }[] = [];

// Check for .test.js file that should be present for each build file

for (const file in buildFileMap) {
   // Map dist/foo.js -> tests/foo.test.js
   const relative: string = path.relative(buildDir, file);
   const testFile: string = path.join(
      testsDir,
      relative.replace(/\.js$/, '.test.js')
   );
   if (!testFileMap[testFile]) {
      missingTests.push({
         file: file,
         test: testFile,
      });
   }
}

// Check for .js file in dist directory for each test file in tests
for (const file in testFileMap) {
   // Map tests/foo.test.js -> dist/foo.js
   const relative: string = path.relative(testsDir, file);
   const buildFile: string = path.join(
      buildDir,
      relative.replace(/\.test\.js$/, '.js')
   );
   if (!buildFileMap[buildFile]) {
      missingFiles.push({
         file: buildFile,
         test: file,
      });
   }
}

// error if test file is missing
// warn if build file is missing

if (missingTests.length > 0) {
   console.error(
      chalk.red('\n❌ Missing test files for the following build files:')
   );
   missingTests.forEach((item: { file: string; test: string }) => {
      console.error(
         chalk.bgRed('ERROR'),
         chalk.grey(
            `- ${chalk.magenta(
               item.file.substring(buildDir.length + 1)
            )} should have ${chalk.magenta(
               item.test.substring(testsDir.length + 1)
            )}`
         )
      );
   });
} else {
   console.log(
      chalk.green('✅ All build files have corresponding test files.')
   );
}

if (missingFiles.length > 0) {
   console.warn(
      chalk.grey('\n⚠️ - Missing build files for the following test files:')
   );
   missingFiles.forEach((item: { file: string; test: string }) => {
      console.warn(
         chalk.bgYellow('WARNING'),
         chalk.grey(
            `- ${chalk.magenta(
               item.test.substring(testsDir.length + 1)
            )} should have ${chalk.magenta(
               item.file.substring(buildDir.length + 1)
            )}`
         )
      );
   });
} else {
   console.log(
      chalk.green('✅ All build files have corresponding test files.')
   );
}

process.exit(missingTests.length > 0 || missingFiles.length > 0 ? 1 : 0);
