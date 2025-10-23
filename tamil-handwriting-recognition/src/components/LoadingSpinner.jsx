const LoadingSpinner = ({ progress, status }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              {status || 'Processing...'}
            </p>
            {progress > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {progress}% complete
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-400 text-center max-w-md">
            Processing your image with Tesseract.js. This may take a few seconds
            depending on the image size and complexity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
