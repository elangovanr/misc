import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ onImageSelect, previewUrl, isLoading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File is too large. Maximum size is 10MB.');
        return;
      }

      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              {isDragActive ? (
                <p className="text-lg text-blue-600 font-medium">Drop the image here</p>
              ) : (
                <>
                  <p className="text-lg text-gray-700 font-medium">
                    Drag & drop an image here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    or click to browse
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {!isLoading && (
            <button
              onClick={() => onImageSelect(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
