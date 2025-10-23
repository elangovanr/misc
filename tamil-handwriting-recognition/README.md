# Tamil Handwriting Recognition

A web-based application that recognizes Tamil handwritten text from images using **Tesseract.js**. All processing happens entirely in the browser - no backend required!

## Features

- **100% Client-Side Processing** - Images never leave your device
- **Drag & Drop Upload** - Easy image upload with drag and drop support
- **Tamil OCR** - Powered by Tesseract.js with Tamil language support
- **Real-time Progress** - Visual feedback during recognition
- **Confidence Scores** - See how confident the OCR is about the results
- **Copy to Clipboard** - Easily copy recognized text
- **Privacy-Friendly** - No data sent to servers
- **Offline Capable** - Works offline after initial load
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tesseract.js** - OCR engine with Tamil support
- **Tailwind CSS** - Styling
- **React Dropzone** - File upload with drag & drop

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tamil-handwriting-recognition
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload an Image**
   - Drag and drop an image of Tamil handwritten text
   - Or click to browse and select an image
   - Supports JPG, PNG formats (max 10MB)

2. **Wait for Processing**
   - The app will automatically start recognizing the text
   - Progress bar shows the current status
   - First load will download Tesseract.js core (~2MB) and Tamil language data (~10MB)

3. **View Results**
   - Recognized Tamil text is displayed in Unicode
   - Confidence score shows OCR accuracy
   - Copy text to clipboard or try another image

## Project Structure

```
tamil-handwriting-recognition/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ImageUploader.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── RecognitionResult.jsx
│   ├── services/        # Business logic
│   │   └── ocrService.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Available Scripts

### `npm run dev`
Starts the development server at `http://localhost:5173`

### `npm run build`
Creates an optimized production build in the `dist/` folder

### `npm run preview`
Preview the production build locally

## How It Works

1. **Image Upload**: User uploads an image through drag & drop or file picker
2. **Validation**: File type and size are validated on the client
3. **OCR Processing**: Tesseract.js processes the image with Tamil language model
4. **Display Results**: Recognized text is displayed with confidence score

All processing happens in your browser using WebAssembly. No server or API calls are needed!

## Performance

- **First Load**: Downloads Tesseract.js (~12MB) - cached for future use
- **Recognition Time**:
  - Small images (< 1MB): 2-5 seconds
  - Medium images (1-5MB): 5-10 seconds
  - Large images (5-10MB): 10-20 seconds

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Requires WebAssembly support.

## Deployment

This is a static site that can be deployed anywhere:

### Vercel (Recommended)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder via Netlify dashboard or CLI
```

### GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

## Limitations

- Works best with clear, high-contrast handwriting
- Accuracy depends on image quality and handwriting style
- Large images may take longer to process
- Requires internet connection for first load (to download Tesseract.js and language data)

## Future Enhancements

- [ ] Batch processing for multiple images
- [ ] Image preprocessing (filters, contrast adjustment)
- [ ] Support for multiple Indian languages
- [ ] Text editing capabilities
- [ ] Export to TXT/PDF formats
- [ ] History/saved recognitions
- [ ] PWA support for offline use
- [ ] Webcam support for real-time recognition

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Dropzone](https://react-dropzone.js.org/) - File upload

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with React + Vite + Tesseract.js**
