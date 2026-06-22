import fs from "fs/promises";
import Papa from "papaparse";

export async function processUpload(
  filePath: string
) {
  const fileContent =
    await fs.readFile(
      filePath,
      "utf8"
    );

  const result = Papa.parse(
    fileContent,
    {
      header: true,
      skipEmptyLines: true,
    }
  );

  return result.data;
}