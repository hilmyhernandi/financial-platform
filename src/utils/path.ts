import path from "path";
import { fileURLToPath } from "url";

/**
 * Utility untuk mendapatkan __dirname dan __filename di ESM.
 * Gunakan:
 *   import { getDirname } from "../utils/esm-path.js";
 *   const __dirname = getDirname(import.meta.url);
 */

export function getDirname(metaUrl: string) {
  const __filename = fileURLToPath(metaUrl);
  return path.dirname(__filename);
}

export function getFilename(metaUrl: string) {
  return fileURLToPath(metaUrl);
}
