# Vercel Deployment Setup

## Current Status

The API has been updated to handle Vercel's serverless environment. However, **file storage requires cloud storage integration** because Vercel has a read-only filesystem.

## Important: Cloud Storage Required

Vercel's serverless functions have a **read-only filesystem**, so files cannot be saved locally. You need to integrate with a cloud storage service.

## Recommended Solutions

### Option 1: Vercel Blob Storage (Recommended for Vercel)

1. Install Vercel Blob:
```bash
npm install @vercel/blob
```

2. Update your upload service to use Vercel Blob Storage
3. Set up Vercel Blob in your Vercel dashboard

### Option 2: AWS S3

1. Install AWS SDK:
```bash
npm install @aws-sdk/client-s3
```

2. Configure AWS credentials in Vercel environment variables
3. Update upload service to save to S3

### Option 3: Cloudinary

1. Install Cloudinary:
```bash
npm install cloudinary
```

2. Set up Cloudinary account and configure credentials
3. Update upload service to use Cloudinary

## Current Behavior

- ✅ No more directory creation errors
- ✅ Files are stored in memory in serverless environments
- ⚠️ Files are NOT persisted (need cloud storage)
- ⚠️ URLs returned won't work until cloud storage is integrated

## Next Steps

1. Choose a cloud storage service
2. Install the required package
3. Update `src/services/uploadService.js` to upload files to cloud storage
4. Update the URL generation to use cloud storage URLs

## Environment Variables for Vercel

Add these in your Vercel dashboard:

```
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp
ALLOWED_AUDIO_TYPES=mp3,wav,ogg,m4a,aac
ALLOWED_VIDEO_TYPES=mp4,avi,mov,wmv,flv,webm,mkv
```

## Testing Locally

The code will work normally in local development (files saved to disk). The serverless detection only activates on Vercel.
