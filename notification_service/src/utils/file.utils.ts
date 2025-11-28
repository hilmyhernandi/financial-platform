import fs from "fs";

/**
 * Memastikan direktori target tersedia.
 * Jika belum ada, fungsi ini akan membuatnya secara rekursif.
 *
 * @param dir - Path direktori yang ingin dipastikan keberadaannya.
 */
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
