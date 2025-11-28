import { fileURLToPath } from "url";
import { dirname, join } from "path";

/**
 * Helper untuk mendapatkan __dirname dan path absolute.
 * Berguna untuk menghindari repetisi kode di berbagai file.
 */
export function getDirname(metaUrl: string): string {
  return dirname(fileURLToPath(metaUrl));
}

/**
 * Join beberapa segmen path jadi satu.
 */
export function resolvePath(...segments: string[]): string {
  return join(...segments);
}
