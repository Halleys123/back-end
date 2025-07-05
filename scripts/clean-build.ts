import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname: string = path.dirname(url.fileURLToPath(import.meta.url));

const folders: Array<string> = ['dist', 'tests', 'scripts'];

folders.forEach((folder: string, index: number) => {
   const dir: string = path.join(__dirname, '..', folder);
   folders[index] = dir;
});

// remove all *.js files in the folders

folders.forEach((folder: string) => {
   fs.readdir(
      folder,
      (err: NodeJS.ErrnoException | null, files: Array<string>) => {
         if (err) {
            console.error(`Error reading directory ${folder}:`, err);
            return;
         }

         files.forEach((file: string) => {
            if (file.endsWith('.js')) {
               const filePath: string = path.join(folder, file);
               fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
                  if (err) {
                     console.error(`Error deleting file ${filePath}:`, err);
                  } else {
                     console.log(`Deleted file: ${filePath}`);
                  }
               });
            }
         });
      }
   );
});
