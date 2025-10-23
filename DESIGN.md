# Tamil Handwriting Recognition System - Design Document

## 1. Project Overview

A web-based application that allows users to upload images of handwritten Tamil text and receive the recognized text output.

### Key Features
- Image upload interface
- Tamil handwriting recognition using OCR
- Display recognized text in Tamil script
- Support for common image formats (JPG, PNG, JPEG)
- User-friendly React frontend
- Scalable Python backend

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │         React Frontend (Port 3000)                │  │
│  │  - Image Upload Component                         │  │
│  │  - Recognition Display Component                  │  │
│  │  - Loading/Error States                           │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST API
                       │ (Multipart Form Data)
┌──────────────────────▼──────────────────────────────────┐
│              Python Backend (Port 5000)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Flask/FastAPI Server                             │  │
│  │  - Image Upload Endpoint                          │  │
│  │  - Image Validation & Processing                  │  │
│  │  - OCR Processing Pipeline                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Tamil OCR Engine                                 │  │
│  │  - EasyOCR (Tamil language support)               │  │
│  │  - Tesseract OCR (Tamil trained data)             │  │
│  │  - Image preprocessing                            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite or Create React App
- **Styling**:
  - Tailwind CSS or Material-UI
  - CSS Modules for component-specific styles
- **HTTP Client**: Axios or Fetch API
- **State Management**: React hooks (useState, useEffect)
- **File Upload**: React Dropzone or native input

### Backend
- **Framework**: Flask or FastAPI (Python 3.9+)
- **OCR Engine**:
  - Primary: EasyOCR (supports Tamil out of the box)
  - Alternative: Tesseract OCR with Tamil language pack
- **Image Processing**: Pillow (PIL), OpenCV
- **CORS**: Flask-CORS or FastAPI CORS middleware
- **File Handling**: Werkzeug (Flask) or built-in (FastAPI)

### Development Tools
- **Package Managers**: npm/yarn (frontend), pip (backend)
- **Environment**: Python virtual environment (venv)
- **Version Control**: Git

---

## 4. Detailed Component Design

### 4.1 Frontend Components

#### App Component (App.jsx)
```
Root component that manages application state
├── Header
├── ImageUploader
│   ├── Upload Area (Drag & Drop)
│   ├── File Input
│   └── Preview
├── RecognitionResult
│   ├── Recognized Text Display
│   ├── Confidence Score
│   └── Copy to Clipboard
└── Footer
```

#### Key States
- `selectedImage`: File object of uploaded image
- `previewUrl`: URL for image preview
- `recognizedText`: Tamil text from OCR
- `isLoading`: Loading state during recognition
- `error`: Error messages

### 4.2 Backend Components

#### API Endpoints

**POST /api/recognize**
- **Purpose**: Upload image and get recognized Tamil text
- **Input**: Multipart form data with image file
- **Output**: JSON with recognized text and confidence
- **Processing Steps**:
  1. Validate file type and size
  2. Save temporary file
  3. Preprocess image (resize, denoise, enhance contrast)
  4. Run OCR engine
  5. Post-process text
  6. Return results
  7. Clean up temporary files

**GET /api/health**
- **Purpose**: Health check endpoint
- **Output**: Server status

#### OCR Processing Pipeline

```python
1. Image Upload & Validation
   ├── Check file type (jpg, png, jpeg)
   ├── Check file size (max 10MB)
   └── Validate image integrity

2. Image Preprocessing
   ├── Convert to grayscale
   ├── Resize if needed (maintain aspect ratio)
   ├── Noise reduction (bilateral filter)
   ├── Contrast enhancement (CLAHE)
   └── Binarization (adaptive threshold)

3. OCR Recognition
   ├── Initialize EasyOCR reader with Tamil language
   ├── Detect text regions
   ├── Recognize characters
   └── Extract text with confidence scores

4. Post-processing
   ├── Filter low confidence results
   ├── Join text segments
   ├── Format output
   └── Return JSON response
```

---

## 5. API Design

### Request Format

**POST /api/recognize**
```
Content-Type: multipart/form-data

Form Data:
  image: [File] (required)
```

### Response Format

**Success Response (200)**
```json
{
  "success": true,
  "text": "வணக்கம் உலகம்",
  "confidence": 0.92,
  "language": "ta",
  "processing_time": 1.23
}
```

**Error Response (400/500)**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Error Codes
- `INVALID_FILE_TYPE`: Unsupported image format
- `FILE_TOO_LARGE`: File exceeds size limit
- `NO_TEXT_FOUND`: No text detected in image
- `PROCESSING_ERROR`: OCR processing failed
- `INVALID_REQUEST`: Missing or invalid parameters

---

## 6. Project Structure

```
tamil-handwriting-recognition/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── RecognitionResult.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Flask/FastAPI app
│   │   ├── routes/
│   │   │   └── recognize.py     # API routes
│   │   ├── services/
│   │   │   ├── ocr_service.py   # OCR logic
│   │   │   └── image_processor.py
│   │   ├── utils/
│   │   │   ├── validators.py
│   │   │   └── config.py
│   │   └── models/              # Future: ML models
│   ├── uploads/                 # Temporary upload directory
│   ├── requirements.txt
│   └── .env
│
├── README.md
├── DESIGN.md
└── .gitignore
```

---

## 7. Data Flow

1. **User uploads image** → Frontend validates file
2. **Frontend sends POST request** → Multipart form data with image
3. **Backend receives request** → Validates and saves temporary file
4. **Image preprocessing** → Enhance quality for better OCR
5. **OCR processing** → EasyOCR recognizes Tamil text
6. **Backend sends response** → JSON with recognized text
7. **Frontend displays result** → Shows Tamil text to user

---

## 8. Implementation Phases

### Phase 1: Project Setup
- Initialize Node.js project with React (Vite)
- Set up Python virtual environment
- Install dependencies (React, Flask/FastAPI, EasyOCR)
- Configure CORS for cross-origin requests
- Set up basic project structure

### Phase 2: Frontend Development
- Create React components (ImageUploader, RecognitionResult)
- Implement file upload with drag & drop
- Add image preview functionality
- Create API service layer
- Add loading and error states
- Style with CSS/Tailwind

### Phase 3: Backend Development
- Create Flask/FastAPI application
- Implement image upload endpoint
- Add file validation (type, size)
- Integrate EasyOCR for Tamil recognition
- Add image preprocessing pipeline
- Implement error handling
- Add logging

### Phase 4: Integration & Testing
- Connect frontend to backend API
- Test with various handwriting samples
- Handle edge cases (no text, unclear images)
- Optimize image preprocessing parameters
- Add proper error messages

### Phase 5: Enhancement & Deployment
- Add confidence score display
- Implement result history (optional)
- Add support for multiple languages (optional)
- Optimize performance
- Add deployment configurations

---

## 9. Technical Considerations

### Image Preprocessing
- **Grayscale conversion**: Reduces complexity
- **Noise reduction**: Improves OCR accuracy
- **Contrast enhancement**: Makes text clearer
- **Binarization**: Converts to black & white for better recognition

### OCR Engine Selection

**EasyOCR (Recommended)**
- Pros: Excellent Tamil support, easy to use, good accuracy
- Cons: Larger model size, slower first load

**Tesseract OCR (Alternative)**
- Pros: Lightweight, fast, well-established
- Cons: Requires separate Tamil trained data installation

### Performance Optimization
- Limit image size (max 10MB)
- Resize large images before processing
- Use async processing for OCR
- Implement request timeout
- Cache OCR model in memory

### Security Considerations
- Validate file types strictly
- Limit upload file size
- Sanitize filenames
- Use temporary storage with cleanup
- Implement rate limiting (future)
- Add authentication (future enhancement)

---

## 10. Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### Backend (requirements.txt)
```
Flask==3.0.0
Flask-CORS==4.0.0
easyocr==1.7.1
Pillow==10.1.0
opencv-python==4.8.1
numpy==1.24.3
torch==2.1.0
python-multipart==0.0.6
```

---

## 11. Environment Configuration

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
VITE_MAX_FILE_SIZE=10485760
```

### Backend (.env)
```
FLASK_ENV=development
UPLOAD_FOLDER=./uploads
MAX_CONTENT_LENGTH=10485760
ALLOWED_EXTENSIONS=png,jpg,jpeg
OCR_LANGUAGE=ta
PORT=5000
```

---

## 12. Future Enhancements

1. **Batch Processing**: Upload multiple images
2. **Language Selection**: Support multiple Indian languages
3. **Text Editing**: Allow users to correct recognized text
4. **Export Options**: Download as TXT, PDF, or DOCX
5. **History**: Save recognition history with timestamps
6. **Mobile App**: React Native mobile application
7. **Advanced OCR**: Custom trained model for better accuracy
8. **Real-time Processing**: Webcam-based recognition
9. **Cloud Storage**: S3/Cloud storage integration
10. **User Accounts**: Authentication and user profiles

---

## 13. Success Criteria

- ✓ Successfully upload images up to 10MB
- ✓ Recognize Tamil handwritten text with >80% accuracy
- ✓ Display results within 3-5 seconds
- ✓ Handle common image formats (JPG, PNG, JPEG)
- ✓ Responsive UI that works on desktop and mobile
- ✓ Clear error messages for invalid inputs
- ✓ Proper Tamil Unicode rendering

---

## 14. Testing Strategy

### Frontend Testing
- File upload validation
- Image preview rendering
- API error handling
- Loading states
- Responsive design

### Backend Testing
- Endpoint validation
- File type checking
- Image processing pipeline
- OCR accuracy with sample images
- Error handling

### Integration Testing
- End-to-end upload and recognition flow
- Different handwriting styles
- Various image qualities
- Edge cases (empty images, corrupted files)

---

## Next Steps

Once this design is approved, we'll proceed with:
1. Project initialization (frontend + backend)
2. Dependencies installation
3. Basic structure setup
4. Component-by-component implementation
5. Integration and testing
