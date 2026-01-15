import fs from 'fs/promises';
import path from 'path';
import { getFileExtension, getFileType, generateUniqueFilename, getUploadDirectory, ensureDirectoryExists, formatFileSize } from '../utils/fileUtils.js';
import { config } from '../config/index.js';

/**
 * Upload service for handling file operations
 */
class UploadService {
  /**
   * Process uploaded file (file is already saved by multer disk storage)
   * @param {object} file - Multer file object
   * @returns {Promise<object>} File information
   */
  async saveFile(file) {
    try {
      // Validate file exists
      if (!file) {
        throw new Error('No file provided');
      }

      // Get file extension and type
      const extension = getFileExtension(file.originalname);
      const fileType = getFileType(extension, config);

      if (!fileType) {
        throw new Error(`Unsupported file type: ${extension}`);
      }

      // Validate file size
      if (file.size > config.upload.maxFileSize) {
        throw new Error(`File size exceeds maximum allowed size of ${formatFileSize(config.upload.maxFileSize)}`);
      }

      // File is already saved by multer, get the path
      const filePath = file.path;
      const filename = path.basename(filePath);

      // Return file information
      return {
        originalName: file.originalname,
        filename: filename,
        fileType: fileType,
        size: file.size,
        mimetype: file.mimetype,
        path: filePath,
        url: `/uploads/${fileType === 'image' ? 'images' : fileType === 'audio' ? 'audio' : 'video'}/${filename}`
      };
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  /**
   * Save multiple files
   * @param {Array} files - Array of multer file objects
   * @returns {Promise<Array>} Array of file information
   */
  async saveFiles(files) {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      const savedFiles = await Promise.all(
        files.map(file => this.saveFile(file))
      );

      return savedFiles;
    } catch (error) {
      throw new Error(`Failed to save files: ${error.message}`);
    }
  }

  /**
   * Delete file from disk
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Get file information
   * @param {string} filePath - Path to file
   * @returns {Promise<object>} File stats
   */
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }
}

export default new UploadService();
