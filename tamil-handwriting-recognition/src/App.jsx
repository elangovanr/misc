import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import LoadingSpinner from './components/LoadingSpinner';
import RecognitionResult from './components/RecognitionResult';
import { recognizeImage } from './services/ocrService';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);

  const handleImageSelect = async (file) => {
    if (!file) {
      // Reset state when image is removed
      setSelectedImage(null);
      setPreviewUrl(null);
      setRecognizedText('');
      setConfidence(0);
      setError(null);
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Start OCR processing
    setIsLoading(true);
    setProgress(0);
    setStatus('Initializing Tesseract.js...');

    try {
      const result = await recognizeImage(url, (prog, stat) => {
        setProgress(prog);

        // Format status messages
        if (stat === 'loading tesseract core') {
          setStatus('Loading Tesseract core...');
        } else if (stat === 'initializing tesseract') {
          setStatus('Initializing Tesseract...');
        } else if (stat === 'loading language traineddata') {
          setStatus('Loading Tamil language data...');
        } else if (stat === 'initializing api') {
          setStatus('Initializing API...');
        } else if (stat === 'recognizing text') {
          setStatus('Recognizing Tamil text...');
        }
      });

      setRecognizedText(result.text);
      setConfidence(result.confidence);
      setStatus('Recognition complete!');
    } catch (err) {
      console.error('Recognition error:', err);
      setError(err.message || 'Failed to recognize text. Please try again.');
      setRecognizedText('');
      setConfidence(0);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setRecognizedText('');
    setConfidence(0);
    setError(null);
    setProgress(0);
    setStatus('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Tamil Handwriting Recognition
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image of handwritten Tamil text and let our AI recognize it for you.
            All processing happens in your browser - your images never leave your device!
          </p>
        </header>

        {/* Main Content */}
        <main>
          <ImageUploader
            onImageSelect={handleImageSelect}
            previewUrl={previewUrl}
            isLoading={isLoading}
          />

          {error && (
            <div className="w-full max-w-2xl mx-auto mt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading && <LoadingSpinner progress={progress} status={status} />}

          {!isLoading && recognizedText && (
            <RecognitionResult
              text={recognizedText}
              confidence={confidence}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://tesseract.projectnaptha.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Tesseract.js
            </a>
            {' '}• Built with{' '}
            <a
              href="https://react.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              React
            </a>
            {' '}and{' '}
            <a
              href="https://vitejs.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Vite
            </a>
          </p>
          <p className="mt-2">
            100% Client-Side Processing • Privacy-Friendly • No Server Required
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
