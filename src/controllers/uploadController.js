import uploadService from '../services/uploadService.js';
import { formatFileSize } from '../utils/fileUtils.js';
import { config } from '../config/index.js';

/**
 * Upload single file
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please provide a file with the field name "file"'
      });
    }

    const fileInfo = await uploadService.saveFile(req.file);
    
    // Generate absolute, publicly accessible URL
    const protocol = req.protocol;
    const host = req.get('host');
    const publicUrl = `${protocol}://${host}${fileInfo.url}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        ...fileInfo,
        url: publicUrl,
        sizeFormatted: formatFileSize(fileInfo.size)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload multiple files
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware
 */
export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please provide files with the field name "files"'
      });
    }

    const filesInfo = await uploadService.saveFiles(req.files);
    
    // Generate absolute, publicly accessible URLs
    const protocol = req.protocol;
    const host = req.get('host');

    res.status(201).json({
      success: true,
      message: `${filesInfo.length} file(s) uploaded successfully`,
      data: filesInfo.map(file => ({
        ...file,
        url: `${protocol}://${host}${file.url}`,
        sizeFormatted: formatFileSize(file.size)
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upload configuration/info
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getUploadInfo = (req, res) => {
  res.json({
    success: true,
    data: {
      maxFileSize: config.upload.maxFileSize,
      maxFileSizeFormatted: formatFileSize(config.upload.maxFileSize),
      allowedImageTypes: config.upload.allowedImageTypes,
      allowedAudioTypes: config.upload.allowedAudioTypes,
      allowedVideoTypes: config.upload.allowedVideoTypes
    }
  });
};
