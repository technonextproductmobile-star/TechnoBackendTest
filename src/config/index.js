import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'jpg,jpeg,png,gif,webp').split(','),
    allowedAudioTypes: (process.env.ALLOWED_AUDIO_TYPES || 'mp3,wav,ogg,m4a,aac').split(','),
    allowedVideoTypes: (process.env.ALLOWED_VIDEO_TYPES || 'mp4,avi,mov,wmv,flv,webm,mkv').split(',')
  }
};
