import { LIMITS } from '@v360/shared/constants';
import multer from 'multer';
import { ApiError } from '../lib/ApiError.js';

// Reads one photo from the form field "photo" into memory, at most 5 MB (FR-IN-05).
// lib/files.js then checks its first bytes and saves it.
const readOnePhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMITS.MAX_PHOTO_SIZE_MB * 1024 * 1024, files: 1 },
}).single('photo');

export function uploadPhoto(req, res, next) {
  readOnePhoto(req, res, (error) => {
    if (error && error.code === 'LIMIT_FILE_SIZE') {
      next(new ApiError(400, `A photo can be at most ${LIMITS.MAX_PHOTO_SIZE_MB} MB.`));
      return;
    }
    if (error) {
      next(new ApiError(400, 'Send one photo in the field "photo".'));
      return;
    }
    if (!req.file) {
      next(new ApiError(400, 'Choose a photo to upload.'));
      return;
    }
    next();
  });
}
