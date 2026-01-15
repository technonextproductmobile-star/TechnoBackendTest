import multer from 'multer';
import path from 'path';
import { config } from '../config/index.js';
import { getFileExtension, getFileType, generateUniqueFilename, getUploadDirectory, ensureDirectoryExists } from '../utils/fileUtils.js';

/**
 * Create multer storage configuration
 * @param {string} fileType - Type of file (image, audio, video)
 * @returns {object} Multer storage configuration
 */
const createStorage = (fileType) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const uploadDir = getUploadDirectory(fileType, config);
        await ensureDirectoryExists(uploadDir);
        cb(null, uploadDir);
      } catch (error) {
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      const uniqueFilename = generateUniqueFilename(file.originalname);
      cb(null, uniqueFilename);
    }
  });
};

/**
 * File filter function to validate file types
 */
const fileFilter = (req, file, cb) => {
  const extension = getFileExtension(file.originalname);
  const fileType = getFileType(extension, config);
  
  if (!fileType) {
    return cb(new Error(`Unsupported file type. Allowed types: Images (${config.upload.allowedImageTypes.join(', ')}), Audio (${config.upload.allowedAudioTypes.join(', ')}), Video (${config.upload.allowedVideoTypes.join(', ')})`), false);
  }
  
  // Attach file type to request for later use
  req.fileType = fileType;
  cb(null, true);
};

/**
 * Create multer instance for file upload with dynamic storage
 */
const createUploadMiddleware = () => {
  return multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          const extension = getFileExtension(file.originalname);
          const fileType = getFileType(extension, config);
          
          if (!fileType) {
            return cb(new Error('Invalid file type'), null);
          }
          
          const uploadDir = getUploadDirectory(fileType, config);
          await ensureDirectoryExists(uploadDir);
          cb(null, uploadDir);
        } catch (error) {
          cb(error, null);
        }
      },
      filename: (req, file, cb) => {
        const uniqueFilename = generateUniqueFilename(file.originalname);
        cb(null, uniqueFilename);
      }
    }),
    fileFilter: fileFilter,
    limits: {
      fileSize: config.upload.maxFileSize
    }
  });
};

/**
 * Single file upload middleware
 */
export const uploadSingle = createUploadMiddleware().single('file');

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = createUploadMiddleware().array('files', 10);
