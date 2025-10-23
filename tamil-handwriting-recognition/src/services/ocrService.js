import { createWorker, PSM } from 'tesseract.js';
import { preprocessImage } from '../utils/imagePreprocessing';

/**
 * Recognizes Tamil text from an image using Tesseract.js
 * @param {string} imageUrl - URL or path to the image
 * @param {function} onProgress - Callback function to track progress (0-100)
 * @returns {Promise<{text: string, confidence: number}>}
 */
export const recognizeImage = async (imageUrl, onProgress) => {
  let preprocessedUrl = null;

  try {
    // Step 1: Preprocess the image to improve OCR accuracy
    if (onProgress) {
      onProgress(0, 'preprocessing image');
    }
    preprocessedUrl = await preprocessImage(imageUrl);

    // Step 2: Create a Tesseract worker with Tamil language
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

    // Step 3: Configure Tesseract for better handwriting recognition
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO, // Automatic page segmentation
      tessedit_char_whitelist: '', // Allow all characters
      preserve_interword_spaces: '1', // Preserve spaces between words
    });

    // Step 4: Perform OCR recognition on preprocessed image
    const { data } = await worker.recognize(preprocessedUrl);

    // Step 5: Terminate worker to free up resources
    await worker.terminate();

    // Step 6: Clean up preprocessed image URL
    if (preprocessedUrl) {
      URL.revokeObjectURL(preprocessedUrl);
    }

    return {
      text: data.text.trim(),
      confidence: data.confidence,
    };
  } catch (error) {
    // Clean up preprocessed image URL on error
    if (preprocessedUrl) {
      URL.revokeObjectURL(preprocessedUrl);
    }

    console.error('OCR Error:', error);
    throw new Error(`Failed to recognize text: ${error.message}`);
  }
};

/**
 * Recognizes text with multiple preprocessing strategies and returns the best result
 * @param {string} imageUrl - URL or path to the image
 * @param {function} onProgress - Callback function to track progress (0-100)
 * @returns {Promise<{text: string, confidence: number}>}
 */
export const recognizeImageAdvanced = async (imageUrl, onProgress) => {
  // This function can be used for even better accuracy by trying multiple approaches
  // and selecting the result with highest confidence
  // For now, we'll use the basic approach with preprocessing
  return recognizeImage(imageUrl, onProgress);
};
