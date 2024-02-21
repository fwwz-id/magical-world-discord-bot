import fs from "fs";
import path from "path";

export default function getFilenamesFromDir(directoryPath: string): string[] {
  const isIgnored = (filename: string) => {
    return /^_|(test|spec|index)/.test(filename);
  };

  // Read the directory
  try {
    let filenames = fs.readdirSync(directoryPath);

    filenames = filenames.filter((filename) => {
      if (isIgnored(filename)) return;

      const filePath = path.join(directoryPath, filename);
      return fs.statSync(filePath).isFile();
    });

    return filenames;
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
    return [];
  }
}
