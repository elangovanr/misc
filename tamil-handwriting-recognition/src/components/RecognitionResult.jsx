import { useState } from 'react';

const RecognitionResult = ({ text, confidence, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Failed to copy text to clipboard');
    }
  };

  const confidenceColor = confidence >= 80 ? 'text-green-600' : confidence >= 60 ? 'text-yellow-600' : 'text-red-600';
  const confidenceLabel = confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Recognized Text
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className={`text-sm font-medium ${confidenceColor}`}>
              {confidenceLabel} ({confidence.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-4 min-h-[150px]">
          <p
            className="text-2xl leading-relaxed text-gray-800 whitespace-pre-wrap"
            style={{ fontFamily: "'Noto Sans Tamil', 'Lohit Tamil', 'Tamil MN', sans-serif" }}
          >
            {text || 'No text recognized'}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            disabled={!text}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
              ${!text ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Try Another</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecognitionResult;
