import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ApiError } from './ApiError.js';

// The one place that saves and deletes uploaded files (NFR-SC-07).
// Files live in the "uploads" folder at the root of the project, outside the program code, and
// get random names, so nobody can guess or overwrite another file.
export const UPLOADS_DIR = path.resolve(import.meta.dirname, '../../../../uploads');

// A JPG file starts with FF D8 FF, a PNG file with 89 50 4E 47. The file name and the type the
// browser sends can be faked, so only the first bytes of the file count (FR-IN-05).
function findImageType(buffer) {
  const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpg) return 'jpg';
  const isPng =
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  if (isPng) return 'png';
  return null;
}

// Saves one photo and returns its name inside the uploads folder, for example "a1b2....jpg".
export async function savePhoto(buffer) {
  const imageType = findImageType(buffer);
  if (!imageType) {
    throw new ApiError(400, 'Only JPG and PNG photos can be uploaded.');
  }
  const fileName = `${randomUUID()}.${imageType}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, fileName), buffer);
  return fileName;
}

// Used when the database save fails after the file was written, so no orphan file stays behind.
export async function deletePhoto(fileName) {
  await unlink(path.join(UPLOADS_DIR, path.basename(fileName)));
}
