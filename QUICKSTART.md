# Quick Start Guide

## Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Start the server:**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Test the API

### Using cURL

**Upload a single image:**
```bash
curl -X POST http://localhost:3000/api/upload/single \
  -F "file=@/path/to/your/image.jpg"
```

**Upload a single audio file:**
```bash
curl -X POST http://localhost:3000/api/upload/single \
  -F "file=@/path/to/your/audio.mp3"
```

**Upload a single video:**
```bash
curl -X POST http://localhost:3000/api/upload/single \
  -F "file=@/path/to/your/video.mp4"
```

**Upload multiple files:**
```bash
curl -X POST http://localhost:3000/api/upload/multiple \
  -F "files=@/path/to/image.jpg" \
  -F "files=@/path/to/audio.mp3" \
  -F "files=@/path/to/video.mp4"
```

**Get upload info:**
```bash
curl http://localhost:3000/api/upload/info
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:3000/api/upload/single`
3. Go to Body → form-data
4. Add key: `file` (type: File)
5. Select a file
6. Send

## Project Structure

```
technoutilback/
├── src/
│   ├── config/          # Configuration
│   │   └── index.js
│   ├── controllers/     # Request handlers
│   │   └── uploadController.js
│   ├── middleware/      # Middleware
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js
│   ├── routes/          # API routes
│   │   └── uploadRoutes.js
│   ├── services/        # Business logic
│   │   └── uploadService.js
│   ├── utils/           # Utilities
│   │   └── fileUtils.js
│   └── index.js         # Entry point
├── uploads/             # Uploaded files
│   ├── images/
│   ├── audio/
│   └── video/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/upload/info` - Get upload configuration
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Supported File Types

- **Images:** jpg, jpeg, png, gif, webp
- **Audio:** mp3, wav, ogg, m4a, aac
- **Video:** mp4, avi, mov, wmv, flv, webm, mkv
