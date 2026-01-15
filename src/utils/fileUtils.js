import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get file extension from filename
 * @param {string} filename 
 * @returns {string} File extension without dot
 */
export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase().slice(1);
};

/**
 * Determine file type category (image, audio, video)
 * @param {string} extension 
 * @param {object} config 
 * @returns {string|null} File type category or null if not supported
 */
export const getFileType = (extension, config) => {
  const ext = extension.toLowerCase();
  
  if (config.upload.allowedImageTypes.includes(ext)) {
    return 'image';
  }
  if (config.upload.allowedAudioTypes.includes(ext)) {
    return 'audio';
  }
  if (config.upload.allowedVideoTypes.includes(ext)) {
    return 'video';
  }
  
  return null;
};

/**
 * Generate unique filename to prevent overwrites
 * @param {string} originalName 
 * @returns {string} Unique filename
 */
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  
  return `${nameWithoutExt}_${timestamp}_${randomString}${extension}`;
};

/**
 * Get upload directory path based on file type
 * @param {string} fileType 
 * @param {object} config 
 * @returns {string} Directory path
 */
export const getUploadDirectory = (fileType, config) => {
  const baseDir = path.resolve(process.cwd(), config.upload.uploadDir);
  return path.join(baseDir, fileType === 'image' ? 'images' : fileType === 'audio' ? 'audio' : 'video');
};

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath 
 */
export const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

/**
 * Format file size to human readable format
 * @param {number} bytes 
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
