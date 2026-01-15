import fs from 'fs/promises';
import path from 'path';
import { getFileExtension, getFileType, generateUniqueFilename, getUploadDirectory, ensureDirectoryExists, formatFileSize, isServerless } from '../utils/fileUtils.js';
import { config } from '../config/index.js';

/**
 * Upload service for handling file operations
 */
class UploadService {
  /**
   * Process uploaded file
   * Handles both disk storage (regular) and memory storage (serverless)
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

      // Generate unique filename
      const filename = generateUniqueFilename(file.originalname);
      
      // Handle serverless vs regular environment
      if (isServerless()) {
        // In serverless (Vercel), file is in memory (file.buffer)
        // For production, you should upload to cloud storage (S3, Cloudinary, Vercel Blob, etc.)
        // For now, we'll return the file info but note that storage is needed
        
        // TODO: Upload to cloud storage service (AWS S3, Cloudinary, Vercel Blob, etc.)
        // For now, return file info without saving
        return {
          originalName: file.originalname,
          filename: filename,
          fileType: fileType,
          size: file.size,
          mimetype: file.mimetype,
          path: null, // Not saved to disk in serverless
          url: `/uploads/${fileType === 'image' ? 'images' : fileType === 'audio' ? 'audio' : 'video'}/${filename}`,
          buffer: file.buffer, // Keep buffer for cloud storage upload
          note: 'File is in memory. Cloud storage integration required for serverless environments.'
        };
      } else {
        // Regular environment - file is already saved to disk by multer
        const filePath = file.path;
        const savedFilename = path.basename(filePath);

        return {
          originalName: file.originalname,
          filename: savedFilename,
          fileType: fileType,
          size: file.size,
          mimetype: file.mimetype,
          path: filePath,
          url: `/uploads/${fileType === 'image' ? 'images' : fileType === 'audio' ? 'audio' : 'video'}/${savedFilename}`
        };
      }
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
