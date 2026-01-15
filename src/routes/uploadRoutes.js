import express from 'express';
import { uploadFile, uploadFiles, getUploadInfo } from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/upload/info
 * @desc    Get upload configuration information
 * @access  Public
 */
router.get('/info', getUploadInfo);

/**
 * @route   POST /api/upload/single
 * @desc    Upload a single file
 * @access  Public
 */
router.post('/single', uploadSingle, uploadFile);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files
 * @access  Public
 */
router.post('/multiple', uploadMultiple, uploadFiles);

export default router;
