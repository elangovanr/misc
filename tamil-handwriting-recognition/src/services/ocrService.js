import { createWorker } from 'tesseract.js';

/**
 * Recognizes Tamil text from an image using Tesseract.js
 * @param {string} imageUrl - URL or path to the image
 * @param {function} onProgress - Callback function to track progress (0-100)
 * @returns {Promise<{text: string, confidence: number}>}
 */
export const recognizeImage = async (imageUrl, onProgress) => {
  try {
    // Create a Tesseract worker with Tamil language
    const worker = await createWorker('tam', 1, {
      logger: (m) => {
        // Track progress during recognition
        if (m.status === 'recognizing text') {
          const progress = Math.floor(m.progress * 100);
          if (onProgress) {
            onProgress(progress, m.status);
          }
        } else if (m.status) {
          // Report other statuses (loading language, initializing, etc.)
          if (onProgress) {
            onProgress(0, m.status);
          }
        }
      },
    });

    // Perform OCR recognition
    const { data } = await worker.recognize(imageUrl);

    // Terminate worker to free up resources
    await worker.terminate();

    return {
      text: data.text.trim(),
      confidence: data.confidence,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error(`Failed to recognize text: ${error.message}`);
  }
};
