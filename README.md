# File Upload API

A Node.js REST API for uploading files with support for images, audio, and video files. Built with Express.js following clean architecture principles.

## Features

- ✅ Upload single or multiple files
- ✅ Support for images (jpg, jpeg, png, gif, webp)
- ✅ Support for audio (mp3, wav, ogg, m4a, aac)
- ✅ Support for video (mp4, avi, mov, wmv, flv, webm, mkv)
- ✅ File type validation
- ✅ File size limits
- ✅ Automatic file organization by type
- ✅ Unique filename generation to prevent overwrites
- ✅ Clean architecture with separation of concerns
- ✅ Error handling middleware
- ✅ Security best practices (Helmet, CORS)

## Project Structure

```
technoutilback/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.js         # Application entry point
├── uploads/             # Uploaded files directory
│   ├── images/
│   ├── audio/
│   └── video/
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd technoutilback
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp
ALLOWED_AUDIO_TYPES=mp3,wav,ogg,m4a,aac
ALLOWED_VIDEO_TYPES=mp4,avi,mov,wmv,flv,webm,mkv
UPLOAD_DIR=./uploads
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Get Upload Information
```
GET /api/upload/info
```
Returns upload configuration including allowed file types and maximum file size.

**Response:**
```json
{
  "success": true,
  "data": {
    "maxFileSize": 10485760,
    "maxFileSizeFormatted": "10 MB",
    "allowedImageTypes": ["jpg", "jpeg", "png", "gif", "webp"],
    "allowedAudioTypes": ["mp3", "wav", "ogg", "m4a", "aac"],
    "allowedVideoTypes": ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"]
  }
}
```

### Upload Single File
```
POST /api/upload/single
Content-Type: multipart/form-data
```

**Request:**
- Field name: `file`
- Body: Form data with file

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "originalName": "example.jpg",
    "filename": "example_1234567890_abc123.jpg",
    "fileType": "image",
    "size": 102400,
    "sizeFormatted": "100 KB",
    "mimetype": "image/jpeg",
    "path": "/path/to/uploads/images/example_1234567890_abc123.jpg",
    "url": "/uploads/images/example_1234567890_abc123.jpg"
  }
}
```

### Upload Multiple Files
```
POST /api/upload/multiple
Content-Type: multipart/form-data
```

**Request:**
- Field name: `files`
- Body: Form data with multiple files

**Response:**
```json
{
  "success": true,
  "message": "2 file(s) uploaded successfully",
  "data": [
    {
      "originalName": "image1.jpg",
      "filename": "image1_1234567890_abc123.jpg",
      "fileType": "image",
      "size": 102400,
      "sizeFormatted": "100 KB",
      "mimetype": "image/jpeg",
      "path": "/path/to/uploads/images/image1_1234567890_abc123.jpg",
      "url": "/uploads/images/image1_1234567890_abc123.jpg"
    },
    {
      "originalName": "audio1.mp3",
      "filename": "audio1_1234567890_def456.mp3",
      "fileType": "audio",
      "size": 2048000,
      "sizeFormatted": "2 MB",
      "mimetype": "audio/mpeg",
      "path": "/path/to/uploads/audio/audio1_1234567890_def456.mp3",
      "url": "/uploads/audio/audio1_1234567890_def456.mp3"
    }
  ]
}
```

## Testing with cURL

### Upload a single file:
```bash
curl -X POST http://localhost:3000/api/upload/single \
  -F "file=@/path/to/your/file.jpg"
```

### Upload multiple files:
```bash
curl -X POST http://localhost:3000/api/upload/multiple \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.mp3"
```

## Testing with Postman

1. Create a new POST request to `http://localhost:3000/api/upload/single`
2. Go to the "Body" tab
3. Select "form-data"
4. Add a key named `file` and change the type to "File"
5. Select a file to upload
6. Send the request

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common error scenarios:
- **400 Bad Request**: Invalid file type, file too large, no file provided
- **404 Not Found**: Route not found
- **500 Internal Server Error**: Server error

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MAX_FILE_SIZE` | Maximum file size in bytes | 10485760 (10MB) |
| `ALLOWED_IMAGE_TYPES` | Comma-separated image extensions | jpg,jpeg,png,gif,webp |
| `ALLOWED_AUDIO_TYPES` | Comma-separated audio extensions | mp3,wav,ogg,m4a,aac |
| `ALLOWED_VIDEO_TYPES` | Comma-separated video extensions | mp4,avi,mov,wmv,flv,webm,mkv |
| `UPLOAD_DIR` | Upload directory path | ./uploads |

## Architecture

This project follows clean architecture principles:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Middleware**: Request processing and validation
- **Utils**: Reusable utility functions
- **Config**: Configuration management
- **Routes**: API route definitions

## Security Features

- Helmet.js for security headers
- CORS configuration
- File type validation
- File size limits
- Input sanitization

## License

ISC
