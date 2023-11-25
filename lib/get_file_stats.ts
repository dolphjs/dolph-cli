import { statSync } from "fs";

export const getFileStats = (filePath: string) => {
  const stats = statSync(filePath);
  const sizeInBytes = stats.size;

  return sizeInBytes;
};
